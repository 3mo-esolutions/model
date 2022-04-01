/* eslint-disable @typescript-eslint/member-ordering */
import { component, css, property, event, TemplateResult, html, TemplateHelper } from '../../../library'
import { Debouncer, Enqueuer, PropertyValues } from '../../..'
import { FieldSelect } from './FieldSelect'
import { Option } from './Option'

export type FieldFetchableSelectParametersType = Record<string, unknown> | void

/**
 * @fires parametersChange {CustomEvent<TDataFetcherParameters | undefined>}
 * @fires dataFetch {CustomEvent<Array<T>>}
 */
@component('mo-field-fetchable-select')
export class FieldFetchableSelect<T, TDataFetcherParameters extends FieldFetchableSelectParametersType = void> extends FieldSelect<T> {
	private static readonly fetchedOptionsRenderLimit = 200

	@event() readonly parametersChange!: EventDispatcher<TDataFetcherParameters | undefined>
	@event() readonly dataFetch!: EventDispatcher<Array<T>>

	@property({ type: Number }) debounce = 500
	@property({ type: Number }) optionsRenderLimit = FieldFetchableSelect.fetchedOptionsRenderLimit
	@property({ type: Object, updated(this: FieldFetchableSelect<T>) { this.refetchData() } }) parameters?: TDataFetcherParameters
	@property({ type: Boolean, reflect: true }) protected fetching = false
	@property({ type: Object }) optionTemplate?: FieldFetchableSelect<T, TDataFetcherParameters>['getOptionTemplate']
	@property({ type: Object }) searchParameters?: FieldFetchableSelect<T, TDataFetcherParameters>['getSearchParameters']
	@property({ type: Object }) fetch: FieldFetchableSelect<T, TDataFetcherParameters>['fetchData'] = () => Promise.resolve([])

	static override get styles() {
		return css`
			${super.styles}

			:host([fetching]) {
				cursor: wait;
			}
		`
	}

	private readonly fetchEnqueuer = new Enqueuer<Array<T>>()
	private readonly searchDebouncer = new Debouncer()

	protected fetchedData = new Array<T>()

	protected override firstUpdated(props: PropertyValues) {
		super.firstUpdated(props)
		if (!this.parameters) {
			this.refetchData()
		}
	}

	protected fetchData(parameters: TDataFetcherParameters | undefined): Promise<Array<T>> {
		return this.fetch(parameters)
	}

	protected getOptionTemplate(data: T, index: number, array: Array<T>): TemplateResult {
		return this.optionTemplate?.(data, index, array) ?? html`
			<mo-option .data=${data} value=${index}>${data}</mo-option>
		`
	}

	protected getSearchParameters(keyword: string): Partial<TDataFetcherParameters> | undefined {
		return this.searchParameters?.(keyword)
	}

	protected override async search(keyword: string) {
		const searchParameters = this.getSearchParameters(keyword)
		if (!searchParameters) {
			return super.search(keyword)
		} else {
			await this.searchDebouncer.debounce(this.debounce)
			await this.refetchData({
				...this.parameters,
				...searchParameters,
			} as TDataFetcherParameters, true)
		}
	}

	async refetchData(parameters = this.parameters, skipValueEvaluation = false) {
		this.parametersChange.dispatch(parameters)
		const fetchPromise = this.fetchData(parameters)

		this.fetching = true
		const data = await this.fetchEnqueuer.enqueue(fetchPromise)
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		this.fetchedData = data || []
		this.dataFetch.dispatch(this.fetchedData)
		this.renderFetchedDataOptions()
		this.fetching = false
		if (!skipValueEvaluation) {
			this.value = this['_value']
		}
	}

	private renderFetchedDataOptions() {
		const optionsTemplate = html`${this.fetchedData.map((...args) => this.getOptionTemplate(...args))}`
		this.fetchedOptions = TemplateHelper.extractAllBySelector(optionsTemplate, 'mo-option') as Array<Option<T>>
	}

	private get fetchedOptions() { return Array.from(this.querySelectorAll<Option<T>>('mo-option[fetched]')) }
	private set fetchedOptions(value) {
		this.fetchedOptions.forEach(o => o.remove())
		const optionsToAppend = value.slice(0, this.optionsRenderLimit)
		const fieldValue = this.value
		if (fieldValue instanceof Array && fieldValue.length > 0) {
			optionsToAppend.push(...value.filter(o => fieldValue.includes(o.value)))
		} else if (fieldValue) {
			const preselectedValueOption = value.find(o => o.value === fieldValue)
			if (preselectedValueOption) {
				optionsToAppend.push(preselectedValueOption)
			}
		}
		optionsToAppend.forEach(o => {
			o.switchAttribute('fetched', true)
			if (this.multiple) {
				o.multiple = true
			}
		})
		this.append(...optionsToAppend)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-fetchable-select': FieldFetchableSelect<unknown>
	}
}