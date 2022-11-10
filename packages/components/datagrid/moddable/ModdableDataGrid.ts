/* eslint-disable @typescript-eslint/member-ordering */
import { css, html, nothing, property, event, style } from '@a11d/lit'
import { LocalStorageEntry } from '@a11d/lit-application'
import { ContextMenuHost } from '../../../shell'
import { DataGrid, FetchableDataGridParametersType, FetchableDataGrid } from '..'
import { DialogDataGridMode, Mode, ModeRepository, sortable } from '.'

/** @fires modeChange {CustomEvent<Mode<TData, TDataFetcherParameters> | undefined>} */
export abstract class ModdableDataGrid<TData, TDataFetcherParameters extends FetchableDataGridParametersType = Record<string, never>, TDetailsElement extends Element | undefined = undefined> extends FetchableDataGrid<TData, TDataFetcherParameters, TDetailsElement> {
	readonly modesRepository = new ModeRepository<TData, TDataFetcherParameters>(this as any)
	private readonly modeStorage = new LocalStorageEntry<number | undefined>(`MoDeL.Components.ModdableDataGrids.${this.tagName.toLowerCase()}.Mode`, undefined, (_, value) => Number(value))
	private readonly dataCache = new Map<number, { page: number, data: Array<TData> }>()

	@event() readonly modeChange!: EventDispatcher<Mode<TData, TDataFetcherParameters> | undefined>

	@property({ type: Boolean }) disableModeCache = false
	@property({ type: Array }) modes = new Array<Mode<TData, TDataFetcherParameters>>()
	@property({
		type: Object,
		updated(
			this: ModdableDataGrid<TData, TDataFetcherParameters, TDetailsElement>,
			mode: Mode<TData, TDataFetcherParameters> | undefined,
		) {
			this.modeStorage.value = mode?.id

			this.deselectAll()

			this.modesRepository.updateDefaultIfNeeded()

			const defaultMode = this.modesRepository.defaultMode
			const m = mode ?? defaultMode

			this.preventFetch = true
			this.setColumns((m.columns ?? defaultMode.columns).map(c => ({ ...c })))
			this.sort(m.sorting ?? defaultMode.sorting)
			this.setPagination(m.pagination ?? defaultMode.pagination)
			this.setParameters(m.parameters ?? defaultMode.parameters)
			this.preventFetch = false

			const cache = !this.mode?.id ? undefined : this.dataCache.get(this.mode.id)
			this.page = cache?.page ?? 1

			this.refetchData()
			this.modeChange.dispatch(mode)
		}
	}) mode = !this.modeStorage.value ? undefined : this.modesRepository.get(this.modeStorage.value)

	static override get styles() {
		return css`
			${super.styles}

			:host {
				--mo-data-grid-modebar-padding: var(--mo-data-grid-toolbar-padding);
			}

			mo-card {
				border-radius: 0 0 var(--mo-border-radius) var(--mo-border-radius);
			}

			:host(:not([hasModebar])) mo-card {
				border-radius: var(--mo-border-radius);
			}

			#modebarFlex {
				border-radius: var(--mo-border-radius) var(--mo-border-radius) 0 0;
				padding: var(--mo-data-grid-modebar-padding);
				background: var(--mo-color-transparent-gray-2);
			}
		`
	}

	private preventFetch = false
	protected override enqueueFetch(...parameters: Parameters<FetchableDataGrid<TData, TDataFetcherParameters, TDetailsElement>['enqueueFetch']>) {
		return this.preventFetch
			? Promise.resolve()
			: super.enqueueFetch(...parameters)
	}

	override setData(...parameters: Parameters<DataGrid<TData, TDetailsElement>['setData']>) {
		super.setData(...parameters)
		if (this.mode?.id) {
			this.dataCache.set(this.mode.id, { page: this.page, data: parameters[0] })
		}
	}

	protected override fetchDirty() {
		return this.disableModeCache || !this.mode?.id ? undefined : this.dataCache.get(this.mode.id)?.data
	}

	protected override get template() {
		return html`
			${!this.hasModebar ? nothing : html`
				<mo-flex id='modebarFlex' direction='horizontal'>
					${this.modebarTemplate}
				</mo-flex>
			`}
			<mo-card ${style({ height: '100%', '--mo-card-body-padding': '0px' })}>
				<mo-flex ${style({ height: '100%' })}>
					${super.template}
				</mo-flex>
			</mo-card>
		`
	}

	private get hasModebar() {
		const hasModebar = this.modesRepository.getAll().length !== 0 || this.modes.length !== 0
		this.switchAttribute('hasModebar', hasModebar)
		return hasModebar
	}

	private get modebarTemplate() {
		const getModeChipTemplate = (mode: Mode<TData, TDataFetcherParameters>) => html`
			<mo-data-grid-mode-chip
				?readOnly=${this.modes.includes(mode)}
				?data-non-sortable=${this.modes.includes(mode)}
				.moddableDataGrid=${this as any}
				.mode=${mode}
				?selected=${this.mode?.id === mode.id}
			></mo-data-grid-mode-chip>
		`
		return html`
			<mo-flex ${style({ width: '*' })} direction='horizontal' alignItems='center' gap='var(--mo-thickness-xl)'>
				<mo-scroller ${style({ overflow: 'auto hidden', maxWidth: 'calc(100% - 40px)' })}>
					<mo-flex direction='horizontal' gap='var(--mo-thickness-l)'>
						${this.modes.map(getModeChipTemplate)}
						${this.temporarySelectedModeTab}
						${sortable({
							data: this.modesRepository.getUnarchived(),
							sortedCallback: this.handleSort,
							getItemTemplate: getModeChipTemplate,
						})}
					</mo-flex>
				</mo-scroller>
				<mo-icon-button icon='add' @click=${this.createNewMode}></mo-icon-button>
			</mo-flex>

			${this.modesRepository.getArchived().length === 0 ? nothing : html`
				<mo-icon-button icon='more_vert' @click=${(e: MouseEvent) => ContextMenuHost.open(e, this.archiveMenuTemplate)}></mo-icon-button>
			`}
		`
	}

	private readonly handleSort = (sortedModes: Array<Mode<TData, TDataFetcherParameters>>) => {
		this.modesRepository.value = [
			...sortedModes,
			...this.modesRepository.getArchived(),
		]
	}

	private get temporarySelectedModeTab() {
		return !this.mode || this.modes.includes(this.mode) || this.mode.isArchived === false ? nothing : html`
			<mo-data-grid-mode-chip data-non-sortable .moddableDataGrid=${this as any} .mode=${this.mode} selected></mo-data-grid-mode-chip>
		`
	}

	private get archiveMenuTemplate() {
		return html`
			${this.modesRepository.getArchived().map(mode => html`
				<mo-context-menu-item
					?activated=${this.mode?.id === mode.id}
					@click=${() => this.mode = mode}
				>${mode.name}</mo-context-menu-item>
			`)}
		`
	}

	protected override get toolbarActionsTemplate() {
		return html`
			${this.hasModebar ? nothing : html`<mo-icon-button icon='visibility' @click=${this.createNewMode}></mo-icon-button>`}
			${super.toolbarActionsTemplate}
		`
	}

	private readonly createNewMode = async () => {
		await new DialogDataGridMode({ moddableDataGrid: this as any }).confirm()
	}
}