/* eslint-disable @typescript-eslint/member-ordering */
import { component, css, event, html, nothing, property, style } from '@a11d/lit'
import { tooltip } from '@3mo/tooltip'
import { Localizer } from '../../localization'
import { Debouncer, Enqueuer } from '../../utilities'
import { DataGrid, DataGridSelectionBehaviorOnDataChange } from './DataGrid'

export type FetchableDataGridParametersType = Record<string, unknown>

type NonPaginatedResult<TData> = Array<TData>

type PaginatedResult<TData> = Readonly<{ data: NonPaginatedResult<TData> } & ({
	hasNextPage: boolean
	dataLength?: undefined
} | {
	hasNextPage?: undefined
	dataLength: number
})>

type Result<TData> = PaginatedResult<TData> | NonPaginatedResult<TData>

Localizer.register(LanguageCode.German, {
	'Make a filter selection': 'Filterauswahl vornehmen',
	'Refetch': 'Neu laden',
})

/**
 * @slot error-no-selection - A slot for displaying an error message when user action is required in order for DataGrid to initiate the fetch.
 * @fires parametersChange {CustomEvent<TDataFetcherParameters>}
 */
@component('mo-fetchable-data-grid')
export class FetchableDataGrid<TData, TDataFetcherParameters extends FetchableDataGridParametersType = Record<string, never>, TDetailsElement extends Element | undefined = undefined> extends DataGrid<TData, TDetailsElement> {
	@event() readonly parametersChange!: EventDispatcher<TDataFetcherParameters | undefined>

	@property({ type: Object }) fetch: (parameters: TDataFetcherParameters) => Promise<Result<TData>> = () => Promise.resolve([])
	@property({ type: Boolean }) silentFetch = false
	@property({ type: Number }) debounce = 500
	@property({
		type: Object,
		async updated(this: FetchableDataGrid<TData, TDataFetcherParameters>, _, oldValue?: TDataFetcherParameters) {
			// Ignore if the data is being set directly
			if (!this.parameters && this.data.length > 0) {
				return
			}

			// "CustomEvent"s convert undefined values to null on event handling
			for (const key in this.parameters) {
				if (this.parameters[key] === null) {
					delete this.parameters[key]
				}
			}

			if (oldValue) {
				await this.fetchDebouncer.debounce(this.debounce)
			}
			this.refetchData()
		}
	}) parameters?: TDataFetcherParameters

	@property({ type: Boolean, reflect: true }) protected fetching = false

	private readonly fetchEnqueuer = new Enqueuer<Result<TData>>()
	private readonly fetchDebouncer = new Debouncer()

	static override get styles() {
		return css`
			${super.styles}

			:host([fetching]) mo-icon-button[icon=refresh] {
				animation: rotate var(--mo-duration-super-slow) ease-in-out infinite;
			}

			@keyframes rotate {
				from {
					transform: rotate(0deg);
				}
				to {
					transform: rotate(360deg);
				}
			}
		`
	}

	protected fetchData(parameters: TDataFetcherParameters): Promise<Result<TData>> {
		return this.fetch(parameters)
	}

	protected getPaginationParameters?: () => Partial<TDataFetcherParameters>
	protected getSortParameters?(): Partial<TDataFetcherParameters>
	// protected getFilterParameters?: () => TDataFetcherParameters

	protected fetchDirty?(parameters: TDataFetcherParameters): Array<TData> | undefined

	private _preventFetchOnSettingPage = true
	override setPage(...args: Parameters<DataGrid<TData, TDetailsElement>['setPage']>) {
		super.setPage(...args)
		if (this.getPaginationParameters && this._preventFetchOnSettingPage === false) {
			this.refetchData()
		}
		this._preventFetchOnSettingPage = false
	}

	override setPagination(...args: Parameters<DataGrid<TData, TDetailsElement>['setPagination']>) {
		super.setPagination(...args)
		if (this.getPaginationParameters) {
			this.refetchData()
		}
	}

	setParameters(parameters: TDataFetcherParameters) {
		this.parameters = parameters
		this.parametersChange.dispatch(this.parameters)
	}

	override sort(...args: Parameters<DataGrid<TData, TDetailsElement>['sort']>) {
		super.sort(...args)
		if (this.getSortParameters) {
			this.refetchData()
		}
	}

	override get renderData() {
		if (this.hasFooter === false) {
			return this.sortedData
		}
		return this.getPaginationParameters
			? this.sortedData.slice(0, this.pageSize)
			: super.renderData
	}

	override get hasPagination() {
		return super.hasPagination || this.getPaginationParameters !== undefined
	}

	override get supportsDynamicPageSize() {
		return super.supportsDynamicPageSize && this.getPaginationParameters === undefined
	}

	private _hasNextPage?: boolean
	override get hasNextPage() {
		return this._hasNextPage ?? super.hasNextPage
	}

	private _dataLength = 0
	override get dataLength() {
		return this.getPaginationParameters ? this._dataLength : super.dataLength
	}

	private _fetchComplete?: Promise<void>
	get fetchComplete() { return this._fetchComplete }

	async refetchData() {
		if (!this.parameters) {
			return
		}

		const paginationParameters = this.getPaginationParameters?.() ?? {}
		const sortParameters = this.getSortParameters?.() ?? {}
		const fetchPromise = this.fetchData({
			...this.parameters,
			...paginationParameters,
			...sortParameters,
		})

		this._fetchComplete = this.enqueueFetch(fetchPromise)
		await this._fetchComplete
	}

	protected async enqueueFetch(fetchPromise: Promise<Result<TData>>) {
		this.fetching = true

		if (this.parameters && this.fetchDirty) {
			const dirtyData = this.fetchDirty(this.parameters)
			if (dirtyData) {
				this.data = dirtyData
			}
		}

		const result = await this.fetchEnqueuer.enqueue(fetchPromise)

		if (!(result instanceof Array)) {
			this._dataLength = result.dataLength ?? 0
			this._hasNextPage = result.hasNextPage ?? (this.page < Math.ceil(result.dataLength / this.pageSize))
		}

		this.setData(
			result instanceof Array ? result : result.data,
			this.silentFetch ? DataGridSelectionBehaviorOnDataChange.Maintain : this.selectionBehaviorOnDataChange,
		)
		this.fetching = false
	}

	protected override get toolbarActionsTemplate() {
		return html`
			<mo-icon-button icon='refresh'
				${tooltip(_('Refetch'))}
				${style({ color: this.fetching ? 'var(--mo-color-accent)' : 'var(--mo-color-gray)' })}
				@click=${() => this.refetchData()}
			></mo-icon-button>
			${super.toolbarActionsTemplate}
		`
	}

	protected override get contentTemplate() {
		switch (true) {
			case this.fetching && this.silentFetch === false:
				return this.fetchingTemplate
			case this.parameters === undefined && this.data.length === 0:
				return this.noSelectionTemplate
			default:
				return super.contentTemplate
		}
	}

	private get fetchingTemplate() {
		return html`
			<mo-circular-progress ${style({ width: '48px', height: '48px', margin: 'auto' })}></mo-circular-progress>
		`
	}

	protected get noSelectionTemplate() {
		return html`
			<slot name='error-no-selection'>
				<mo-error icon='touch_app'>${_('Make a filter selection')}</mo-error>
			</slot>
		`
	}

	protected override get selectionToolbarTemplate() {
		return this.fetching ? nothing : super.selectionToolbarTemplate
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-fetchable-data-grid': FetchableDataGrid<unknown, Record<string, never>>
	}
}