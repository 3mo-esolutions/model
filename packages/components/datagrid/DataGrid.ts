import { property, component, Component, html, css, TemplateResult, live, query, nothing, ifDefined, PropertyValues, event, queryAll, style, literal, staticHtml } from '../../library'
import { ContextMenuHost, NotificationHost } from '../../shell'
import { observeMutation, LocalStorageEntry, SlotController, ExcelHelper, observeResize } from '../../utilities'
import { Localizer } from '../../localization'
import { ColumnDefinition, DataGridCell, DataGridColumn, DataGridFooter, DataGridHeader, DataGridRow, DataGridSidePanel, DataGridSidePanelTab } from '.'

Localizer.register(LanguageCode.English, {
	'${count:pluralityNumber} entries selected': [
		'1 entry selected',
		'${count} entries selected',
	]
})

Localizer.register(LanguageCode.German, {
	'Exporting excel file': 'Die Excel-Datei wird exportiert',
	'No results': 'Kein Ergebnis',
	'${count:pluralityNumber} entries selected': [
		'1 Eintrag ausgewählt',
		'${count} Einträge ausgewählt',
	],
	'Options': 'Optionen'
})

export type DataGridPagination = 'auto' | number

export const enum DataGridSelectionMode {
	None = 'none',
	Single = 'single',
	Multiple = 'multiple',
}

export const enum DataGridSortingStrategy {
	Descending = 'descending',
	Ascending = 'ascending',
}

export const enum DataGridSelectionBehaviorOnDataChange {
	Reset = 'reset',
	Prevent = 'prevent',
	Maintain = 'maintain',
}

export const enum DataGridEditability {
	Never = 'never',
	OnRowClick = 'on-row-click',
	Always = 'always',
}

export type DataGridSorting<TData> = {
	selector: KeyPathOf<TData>
	strategy: DataGridSortingStrategy
}

/**
 * @slot - Use this slot only for declarative DataGrid APIs e.g. setting ColumnDefinitions via `mo-data-grid-columns` tag
 * @slot toolbar - The horizontal bar above DataGrid's contents
 * @slot filter - A vertical bar for elements which filter DataGrid's data. It is opened through an icon-button in the toolbar.
 * @slot sum - A horizontal bar in the DataGrid's footer for showing sums. Calculated sums are also placed here by default.
 * @slot settings - A vertical bar for elements which change DataGrid's settings. It is pre-filled with columns' settings and can be opened through an icon-button in the toolbar.
 * @slot fab - A wrapper at the bottom right edge, floating right above the footer, expecting Floating Action Button to be placed in.
 * @slot error-no-content - A slot for displaying an error message when no data is available.
 * @fires dataChange {CustomEvent<Array<TData>>}
 * @fires selectionChange {CustomEvent<Array<TData>>}
 * @fires pageChange {CustomEvent<number>}
 * @fires paginationChange {CustomEvent<DataGridPagination | undefined>}
 * @fires columnsChange {CustomEvent<Array<ColumnDefinition<TData>>>}
 * @fires sidePanelOpen {CustomEvent<DataGridSidePanelTab>}
 * @fires sidePanelClose {CustomEvent}
 * @fires sortingChange {CustomEvent<DataGridSorting<TData>>}
 * @fires rowClick {CustomEvent<DataGridRow<TData, TDetailsElement>>}
 * @fires rowConnected {CustomEvent<DataGridRow<TData, TDetailsElement>>}
 * @fires rowDisconnected {CustomEvent<DataGridRow<TData, TDetailsElement>>}
 * @fires rowDoubleClick {CustomEvent<DataGridRow<TData, TDetailsElement>>}
 * @fires rowDetailsOpen {CustomEvent<DataGridRow<TData, TDetailsElement>>}
 * @fires rowDetailsClose {CustomEvent<DataGridRow<TData, TDetailsElement>>}
 * @fires rowEdit {CustomEvent<DataGridRow<TData, TDetailsElement>>}
 * @fires cellEdit {CustomEvent<DataGridCell<any, TData, TDetailsElement>>}
 */
@component('mo-data-grid')
export class DataGrid<TData, TDetailsElement extends Element | undefined = undefined> extends Component {
	static readonly rowHeight = new LocalStorageEntry<number>('MoDeL.Components.DataGrid.RowHeight', 35)
	static readonly pageSize = new LocalStorageEntry<Exclude<DataGridPagination, 'auto'>>('MoDeL.Components.DataGrid.PageSize', 25)
	static readonly hasAlternatingBackground = new LocalStorageEntry('MoDeL.Components.DataGrid.HasAlternatingBackground', true)
	protected static readonly virtualizationThreshold: number = 50

	@event() readonly dataChange!: EventDispatcher<Array<TData>>
	@event() readonly selectionChange!: EventDispatcher<Array<TData>>
	@event() readonly pageChange!: EventDispatcher<number>
	@event() readonly paginationChange!: EventDispatcher<DataGridPagination | undefined>
	@event() readonly columnsChange!: EventDispatcher<Array<ColumnDefinition<TData>>>
	@event() readonly sidePanelOpen!: EventDispatcher<DataGridSidePanelTab>
	@event() readonly sidePanelClose!: EventDispatcher
	@event() readonly sortingChange!: EventDispatcher<DataGridSorting<TData> | undefined>
	@event() readonly rowConnected!: EventDispatcher<DataGridRow<TData, TDetailsElement>>
	@event() readonly rowDisconnected!: EventDispatcher<DataGridRow<TData, TDetailsElement>>
	@event() readonly rowClick!: EventDispatcher<DataGridRow<TData, TDetailsElement>>
	@event() readonly rowDoubleClick!: EventDispatcher<DataGridRow<TData, TDetailsElement>>
	@event() readonly rowDetailsOpen!: EventDispatcher<DataGridRow<TData, TDetailsElement>>
	@event() readonly rowDetailsClose!: EventDispatcher<DataGridRow<TData, TDetailsElement>>
	@event() readonly rowEdit!: EventDispatcher<DataGridRow<TData, TDetailsElement>>
	@event() readonly cellEdit!: EventDispatcher<DataGridCell<any, TData, TDetailsElement>>

	@property({ type: Array }) data = new Array<TData>()
	@property({ type: Array }) columns = new Array<ColumnDefinition<TData>>()

	@property({ type: Boolean, reflect: true }) headerHidden = false
	@property({ type: Boolean }) preventContentScroll = false
	@property({ type: Number }) page = 1
	@property({ reflect: true, converter: (value: string | null) => Number.isNaN(Number(value)) ? value : Number(value) }) pagination?: DataGridPagination

	@property({ type: Object }) sorting?: DataGridSorting<TData>

	@property({ reflect: true }) selectionMode = DataGridSelectionMode.None
	@property({ type: Object }) isDataSelectable?: (data: TData) => boolean
	@property({ type: Array }) selectedData = new Array<TData>()
	@property({ type: Boolean }) selectOnClick = false
	@property() selectionBehaviorOnDataChange = DataGridSelectionBehaviorOnDataChange.Reset

	@property({ type: Boolean }) multipleDetails = false
	@property({ updated: subDataGridSelectorChanged }) subDataGridDataSelector?: KeyPathOf<TData>
	@property({ type: Object }) hasDataDetail?: (data: TData) => boolean
	@property({ type: Boolean }) detailsOnClick = false

	@property({ type: Boolean }) primaryContextMenuItemOnDoubleClick = false

	@property({ reflect: true }) editability = DataGridEditability.Never

	@property({ type: Object }) getRowDetailsTemplate?: (data: TData) => TemplateResult
	@property({ type: Object }) getRowContextMenuTemplate?: (data: Array<TData>) => TemplateResult

	@property() sidePanelTab: DataGridSidePanelTab | undefined
	@property({ type: Boolean }) sidePanelHidden = false
	@property({ type: Boolean }) selectionToolbarDisabled = false
	@property({ type: Boolean, reflect: true }) hasAlternatingBackground = DataGrid.hasAlternatingBackground.value

	@property({ type: Boolean }) preventFabCollapse = false
	@property({ type: Boolean, reflect: true }) protected fabSlotCollapsed = false

	@queryAll('[mo-data-grid-row]') readonly rows!: Array<DataGridRow<TData, TDetailsElement>>
	@query('mo-data-grid-header') private readonly header?: DataGridHeader<TData>
	@query('#rowsContainer') private readonly rowsContainer?: HTMLElement
	@query('mo-data-grid-footer') private readonly footer?: DataGridFooter<TData>
	@query('mo-data-grid-side-panel') private readonly sidePanel?: DataGridSidePanel<TData>
	@query('slot[name=column]') private readonly columnsSlot?: HTMLSlotElement

	lastActiveSelection?: { data: TData, selected: boolean }

	setPage(page: number) {
		this.page = page
		this.pageChange.dispatch(page)
	}

	setPagination(pagination?: DataGridPagination) {
		this.pagination = pagination
		this.paginationChange.dispatch(pagination)
	}

	setData(data: Array<TData>, selectionBehavior = this.selectionBehaviorOnDataChange) {
		this.data = data
		switch (selectionBehavior) {
			case DataGridSelectionBehaviorOnDataChange.Reset:
				this.deselectAll()
				break
			case DataGridSelectionBehaviorOnDataChange.Maintain:
				this.select(this.previouslySelectedData)
				break
		}
		this.dataChange.dispatch(data)
	}

	selectAll() {
		if (this.selectionMode === DataGridSelectionMode.Multiple) {
			this.select([...this.data])
		}
	}

	deselectAll() {
		this.select([])
	}

	select(data: Array<TData>) {
		if (this.hasSelection) {
			const selectableData = data.filter(d => this.isSelectable(d))
			this.selectedData = selectableData
			this.selectionChange.dispatch(selectableData)
		}
	}

	isSelectable(data: TData) {
		return this.isDataSelectable?.(data) ?? true
	}

	hasDetail(data: TData) {
		return this.hasDataDetail?.(data) ?? true
	}

	async openRowDetails() {
		await Promise.all(this.detailedRows.map(row => row.setDetails(true)))
	}

	async closeRowDetails() {
		await Promise.all(this.detailedRows.map(row => row.setDetails(false)))
	}

	sort(sorting?: DataGridSorting<TData>) {
		this.sorting = sorting
		this.sortingChange.dispatch(sorting)
	}

	unsort() {
		this.sort(undefined)
	}

	setColumns(columns: Array<ColumnDefinition<TData>>) {
		this.columns = columns
		this.columnsChange.dispatch(columns)
		this.requestUpdate()
	}

	extractColumns() {
		const extractedColumns = this.elementExtractedColumns.length > 0
			? this.elementExtractedColumns
			: this.autoGeneratedColumns
		this.setColumns(extractedColumns)
	}

	handleEdit(data: TData, dataSelector: KeyPathOf<TData>, value: KeyPathValueOf<TData, KeyPathOf<TData>> | undefined) {
		const row = this.rows.find(r => r.data === data)
		const cell = row?.cells.find(c => c.dataSelector === dataSelector)
		if (row && cell && value !== undefined && cell.value !== value) {
			row.requestUpdate()
			setValueByKeyPath(data, dataSelector, value)
			this.cellEdit.dispatch(cell)
		}
	}

	navigateToSidePanelTab(tab?: DataGridSidePanelTab) {
		this.sidePanelTab = tab
		!tab ? this.sidePanelClose.dispatch() : this.sidePanelOpen.dispatch(tab)
	}

	exportExcelFile() {
		try {
			const selectors = this.visibleColumns.map(c => c.dataSelector)
			ExcelHelper.generate(this.data, selectors)
			NotificationHost.instance.notifyInfo(_('Exporting excel file'))
		} catch (error: any) {
			NotificationHost.instance.notifyError(error.message)
			throw error
		}
	}

	get detailedRows(): Array<DataGridRow<TData, TDetailsElement>> {
		return this.rows.filter(row => this.hasDetail(row.data))
	}

	get isSubDataGrid() {
		const isSubDataGrid = this.parentElement?.tagName.toLowerCase() === 'slot'
		this.switchAttribute('subDataGrid', isSubDataGrid)
		return isSubDataGrid
	}

	get hasDetails() {
		return !!this.getRowDetailsTemplate
			&& this.data.some(data => this.hasDetail(data))
			&& (!this.subDataGridDataSelector || this.data.some(data => Array.isArray(getValueByKeyPath(data, this.subDataGridDataSelector!))))
	}

	get hasSelection() {
		return this.selectionMode !== DataGridSelectionMode.None
	}

	get hasContextMenu() {
		return this.getRowContextMenuTemplate !== undefined
	}

	get toolbarElements() {
		return Array.from(this.children).filter(c => c.slot === 'toolbar' && c.getAttribute('hidden') !== '')
	}

	get filterElements() {
		return Array.from(this.children).filter(c => c.slot === 'filter' && c.getAttribute('hidden') !== '')
	}

	get hasToolbar() {
		return this.toolbarElements.length > 0
	}

	get hasFilters() {
		return this.filterElements.length > 0
	}

	get hasSums() {
		const hasSums = !!this.columns.find(c => c.sumHeading) || !!this.querySelector('* [slot="sum"]') || !!this.renderRoot.querySelector('slot[name="sum"] > *')
		this.switchAttribute('hasSums', hasSums)
		return hasSums
	}

	get hasFabs() {
		const hasFabs = !!this.querySelector('* [slot=fab]') || !!this.renderRoot.querySelector('#flexFab *:not(slot[name=fab])')
		this.switchAttribute('hasFabs', hasFabs)
		return hasFabs
	}

	get hasPagination() {
		return this.pagination !== undefined
	}

	get supportsDynamicPageSize() {
		return this.hasPagination
	}

	get pageSize() {
		const dynamicPageSize = (pageSize: number) =>
			this.supportsDynamicPageSize ? pageSize : DataGrid.pageSize.value

		if (!this.pagination) {
			return dynamicPageSize(this.data.length)
		}

		if (this.pagination === 'auto') {
			const rowsHeight = this.rowsContainer?.clientHeight
			const rowHeight = DataGrid.rowHeight.value
			const pageSize = Math.floor((rowsHeight || 0) / rowHeight) || 1
			return dynamicPageSize(pageSize)
		}

		return this.pagination
	}

	get hasFooter() {
		return this.hasPagination || this.hasSums
	}

	get dataLength(): number | undefined {
		return this.data.length
	}

	get maxPage() {
		return this.dataLength ? Math.ceil(this.dataLength / this.pageSize) : undefined
	}

	get hasNextPage() {
		return this.page !== this.maxPage
	}

	// eslint-disable-next-line @typescript-eslint/member-ordering
	constructor() {
		super()
		this.switchAttribute('mo-data-grid', true)
		new SlotController(this, async () => {
			this.hasSums
			this.hasFabs
			await this.updateComplete
			this.style.setProperty('--mo-data-grid-fab-slot-width', `${this.renderRoot.querySelector('slot[name=fab]')?.getBoundingClientRect().width || 75}px`)
		})
	}

	protected override updated(...parameters: Parameters<Component['updated']>) {
		this.header?.requestUpdate()
		this.sidePanel?.requestUpdate()
		this.footer?.requestUpdate()
		this.rows.forEach(row => row.requestUpdate())
		return super.updated(...parameters)
	}

	protected override firstUpdated(props: PropertyValues) {
		super.firstUpdated(props)
		this.extractColumns()
		this.rowEdit.subscribe(() => this.requestUpdate())
		this.cellEdit.subscribe(() => this.requestUpdate())
		this.setPage(1)
	}

	static override get styles() {
		return css`
			:host {
				--mo-data-grid-column-details-width: 20px;
				--mo-data-grid-column-selection-width: 40px;
				--mo-data-grid-column-more-width: 20px;

				--mo-data-grid-header-height: 32px;
				--mo-data-grid-footer-min-height: 40px;
				--mo-data-grid-toolbar-padding: var(--mo-thickness-xl);
				--mo-data-grid-border: 1px solid var(--mo-color-transparent-gray-3);

				/* --mo-data-grid-columns Generated in JS */
				--mo-data-grid-columns-gap: 6px;

				--mo-data-grid-row-tree-line-width: 8px;
				--mo-details-data-grid-left-margin: 26px;
				--mo-data-grid-cell-padding: 3px;

				--mo-data-grid-selection-background: rgba(var(--mo-color-accent-base), 0.5);

				--mo-data-grid-row-height: ${DataGrid.rowHeight.value}px;
				display: flex;
				flex-direction: column;
				height: 100%;
				overflow-x: hidden;
			}

			/* Don't try to use ":nth-child(even)" as it won't work for virtualized data-grids */
			:host([hasAlternatingBackground]:not([subDataGrid])) [mo-data-grid-row][data-has-alternating-background] {
				background: var(--mo-alternating-background);
			}

			:host(:not([selectionMode="none"])) {
				--mo-data-grid-row-tree-line-width: 18px;
			}

			:host([hasDetails]) {
				--mo-data-grid-row-tree-line-width: 18px;
			}

			:host([subDataGrid]) mo-data-grid-header {
				--mo-data-grid-border: hidden;
			}

			:host([subDataGrid]:host-context(:not([hasDetails]):not([selectionMode=single]):not([selectionMode=multiple]))) {
				padding: 0px !important;
			}

			:host([subDataGrid]:not([headerHidden])) {
				background: var(--mo-color-transparent-gray-1);
			}

			:host(:not([headerHidden])[subDataGrid]:host-context(:not([hasDetails]):not([selectionMode=single]):not([selectionMode=multiple]))) {
				margin: 16px var(--mo-details-data-grid-left-margin);
				width: calc(100% - calc(var(--mo-details-data-grid-left-margin) * 2));
			}

			:host([headerHidden][subDataGrid]:host-context(:not([hasDetails]):not([selectionMode=single]):not([selectionMode=multiple]))) {
				margin: 0px 0px 0px var(--mo-details-data-grid-left-margin);
				width: calc(100% - var(--mo-details-data-grid-left-margin));
			}

			#flexToolbar {
				position: relative;
				padding: var(--mo-data-grid-toolbar-padding);
			}

			#flexToolbar mo-icon-button {
				align-self: flex-start;
				color: var(--mo-color-gray);
			}

			#flexSelectionToolbar {
				background: var(--mo-color-surface);
				position: absolute;
				top: 0px;
				left: 0px;
				right: 0px;
				bottom: 0px;
				width: 100%;
				height: 100%;
				z-index: 1;
			}

			#flexSelectionToolbar > mo-flex {
				background: var(--mo-data-grid-selection-background);
				height: 100%;
				align-items: center;
			}

			#flexSelectionToolbar mo-icon-button {
				align-self: center;
				color: var(--mo-color-foreground);
			}

			#flexActions {
				align-items: center;
				justify-content: center;
				padding: 0 var(--mo-thickness-m) 0 var(--mo-thickness-xl);
				margin: var(--mo-thickness-m) 0;
				cursor: pointer;
				background: var(--mo-color-accent-transparent);
				height: calc(100% - calc(2 * var(--mo-thickness-m)));
				max-height: 45px;
			}

			#flexFab {
				position: absolute;
				top: -28px;
				right: 16px;
				transition: var(--mo-data-grid-fab-transition, var(--mo-duration-quick));
			}

			:host([fabSlotCollapsed][hasFabs]) #flexFab {
				transform: scale(0);
				opacity: 0;
			}

			mo-data-grid-footer {
				transition: var(--mo-data-grid-fab-transition, var(--mo-duration-quick));
			}

			:host([hasSums][hasFabs]:not([fabSlotCollapsed])) mo-data-grid-footer {
				--mo-data-grid-footer-trailing-padding: calc(var(--mo-data-grid-fab-slot-width, 56px) + 16px);
			}

			slot[name=fab] {
				display: block;
				z-index: 1;
			}

			mo-error, ::slotted(mo-error) {
				height: 100%;
			}
		`
	}

	protected override get template() {
		return html`
			<slot name='column' hidden ${observeMutation(() => this.requestUpdate())}>${this.columnsTemplate}</slot>
			${this.toolbarTemplate}
			<mo-splitter direction='horizontal-reversed' ${style({ height: '100%' })} .resizerTemplate=${html`
				<mo-splitter-resizer-line style='--mo-splitter-resizer-line-thickness: 1px; --mo-splitter-resizer-line-idle-background: var(--mo-color-transparent-gray-3); --mo-splitter-resizer-line-horizontal-transform: scaleX(5);'></mo-splitter-resizer-line>
			`}>
				${this.sidePanelTab === undefined ? nothing : html`
					<mo-splitter-item size='min(25%, 300px)' min='max(15%, 250px)' max='min(50%, 750px)'>
						<mo-data-grid-side-panel
							.dataGrid=${this as any}
							tab=${ifDefined(this.sidePanelTab)}
						>
							<slot slot='settings' name='settings'></slot>
							<slot slot='filter' name='filter'></slot>
						</mo-data-grid-side-panel>
					</mo-splitter-item>
				`}

				<mo-splitter-item ${style({ position: 'relative' })}>
					<mo-flex ${style({ width: '*', position: 'relative' })}>
						<!-- Do not try to cache the content via "cache" directive as it is problematic for virtualized DataGrids -->
						${this.contentTemplate}
					</mo-flex>
				</mo-splitter-item>
			</mo-splitter>
		`
	}

	protected get columnsTemplate() {
		return nothing
	}

	protected get rowElementTag() {
		return literal`mo-data-grid-default-row`
	}

	protected get fabTemplate() {
		// These also update the respective attributes for now
		this.hasSums
		this.hasFabs
		return html`
			<slot name='fab' @slotchange=${() => { this.hasSums; this.hasFabs }}></slot>
		`
	}

	protected get contentTemplate() {
		return !this.data.length ? this.noContentTemplate : this.dataGridTemplate
	}

	protected get noContentTemplate() {
		return html`
			<slot name='error-no-content'>
				<mo-error icon='youtube_searched_for'>${_('No results')}</mo-error>
			</slot>
		`
	}

	private get dataGridTemplate() {
		this.provideCssColumnsProperties()
		this.switchAttribute('hasDetails', this.hasDetails)
		return !this.isSubDataGrid && !this.preventContentScroll ? html`
			<mo-grid ${style({ height: '*' })} rows='* auto'>
				<mo-scroller ${style({ minHeight: 'var(--mo-data-grid-content-min-height, calc(2.5 * var(--mo-data-grid-row-height) + var(--mo-data-grid-header-height)))' })}>
					<mo-grid ${style({ height: '100%' })} rows='auto *'>
						${this.headerTemplate}
						${this.rowsTemplate}
					</mo-grid>
				</mo-scroller>
				${this.footerTemplate}
			</mo-grid>
		` : html`
			<mo-grid ${style({ height: '*' })} rows='auto * auto'>
				${this.headerTemplate}
				${this.rowsTemplate}
				${this.footerTemplate}
			</mo-grid>
		`
	}

	protected get headerTemplate() {
		return html`
			<mo-data-grid-header .dataGrid=${this as any} ?hidden=${this.headerHidden}></mo-data-grid-header>
		`
	}

	private get rowsTemplate() {
		const getRowTemplate = (data: TData, index: number) => this.getRowTemplate(data, index)
		const shallVirtualize = this.isSubDataGrid === false && this.renderData.length > DataGrid.virtualizationThreshold
		const content = shallVirtualize === false
			? this.renderData.map(getRowTemplate)
			: html`<mo-virtualized-scroller .items=${this.renderData} .getItemTemplate=${getRowTemplate as any}></mo-virtualized-scroller>`
		return this.preventContentScroll || this.isSubDataGrid ? html`
			<mo-flex id='rowsContainer'
				${style({ gridRow: '2', gridColumn: '1 / last-line' })}
				${observeResize(() => this.requestUpdate())}
				@scroll=${this.handleScroll}
			>
				${content}
			</mo-flex>
		` : html`
			<mo-scroller id='rowsContainer'
				${style({ gridRow: '2', gridColumn: '1 / last-line' })}
				${observeResize(() => this.requestUpdate())}
				@scroll=${this.handleScroll}
			>
				${content}
			</mo-scroller>
		`
	}

	protected getRowTemplate(data: TData, index: number) {
		return staticHtml`
			<${this.rowElementTag} part='row'
				.dataGrid=${this as any}
				.data=${data}
				?selected=${live(this.selectedData.includes(data))}
				?data-has-alternating-background=${index % 2 === 1}
			></${this.rowElementTag}>
		`
	}

	protected get footerTemplate() {
		return html`
			<mo-flex ${style({ position: 'relative' })}>
				<mo-flex id='flexFab' direction='vertical-reversed' gap='var(--mo-thickness-l)'>
					${this.fabTemplate}
				</mo-flex>
				<mo-data-grid-footer
					.dataGrid=${this as any}
					?hidden=${this.hasFooter === false}
					page=${this.page}
					@pageChange=${(e: CustomEvent<number>) => this.setPage(e.detail)}
				>
					<slot name='sum' slot='sum'></slot>
				</mo-data-grid-footer>
			</mo-flex>
		`
	}

	protected get toolbarTemplate() {
		return this.hasToolbar === false ? nothing : html`
			<mo-flex id='flexToolbar' direction='horizontal' gap='var(--mo-thickness-l)' wrap='wrap' justifyContent='end' alignItems='center'>
				<mo-flex direction='horizontal' alignItems='inherit' gap='var(--mo-thickness-l)' wrap='wrap' ${style({ width: '*' })}>
					<slot name='toolbar'></slot>
				</mo-flex>
				<mo-flex direction='horizontal' gap='var(--mo-thickness-l)'>
					<slot name='toolbarAction'></slot>
					${this.toolbarActionsTemplate}
					${this.selectionToolbarTemplate}
				</mo-flex>
			</mo-flex>
		`
	}

	protected get selectionToolbarTemplate() {
		return this.selectionToolbarDisabled === true || this.selectedData.length === 0 ? nothing : html`
			<mo-flex id='flexSelectionToolbar'>
				<mo-flex direction='horizontal' gap='30px' ${style({ placeSelf: 'stretch' })}>
					<div ${style({ fontWeight: '500', margin: '0 var(--mo-thickness-m)' })}>
						${_('${count:pluralityNumber} entries selected', { count: this.selectedData.length })}
					</div>
					<mo-flex id='flexActions' direction='horizontal' ?hidden=${!this.getRowContextMenuTemplate} @click=${this.openContextMenu}>
						<div ${style({ width: '*' })}>${_('Options')}</div>
						<mo-icon-button dense icon='arrow_drop_down' ${style({ display: 'flex', alignItems: 'center', justifyContent: 'center' })}></mo-icon-button>
					</mo-flex>
					<div ${style({ width: '*' })}></div>
					<mo-icon-button icon='close' @click=${() => this.deselectAll()}></mo-icon-button>
				</mo-flex>
			</mo-flex>
		`
	}

	protected get toolbarActionsTemplate() {
		return html`
			<mo-icon-button icon='filter_list'
				?hidden=${this.hasFilters === false}
				${style({ color: this.sidePanelTab === DataGridSidePanelTab.Filters ? 'var(--mo-color-accent)' : 'var(--mo-color-gray)' })}
				@click=${() => this.navigateToSidePanelTab(this.sidePanelTab === DataGridSidePanelTab.Filters ? undefined : DataGridSidePanelTab.Filters)}
			></mo-icon-button>

			<mo-icon-button icon='settings'
				${style({ color: this.sidePanelTab === DataGridSidePanelTab.Settings ? 'var(--mo-color-accent)' : 'var(--mo-color-gray)' })}
				@click=${() => this.navigateToSidePanelTab(this.sidePanelTab === DataGridSidePanelTab.Settings ? undefined : DataGridSidePanelTab.Settings)}
			></mo-icon-button>
		`
	}

	private readonly openContextMenu = async () => {
		if (!this.getRowContextMenuTemplate) {
			return
		}
		const actionsFlexElement = this.renderRoot.querySelector<HTMLElement>('#flexActions')
		if (!actionsFlexElement) {
			return
		}
		await ContextMenuHost.open(actionsFlexElement, 'BOTTOM_START', this.getRowContextMenuTemplate(this.selectedData))
	}

	// The reason for not doing this in the CSS is that we need to trim all the 0px values out of the columns
	// because the 'grid column gap' renders a gap no matter if the column is 0px or not
	private provideCssColumnsProperties() {
		this.style.setProperty('--mo-data-grid-content-width', this.dataColumnsWidths.join(' '))
		this.style.setProperty('--mo-data-grid-columns', this.columnsWidths.join(' '))
	}

	get columnsWidths() {
		return [
			this.detailsColumnWidth,
			this.selectionColumnWidth,
			...this.dataColumnsWidths,
			this.moreColumnWidth
		].filter((c): c is string => c !== undefined)
	}

	get detailsColumnWidth() {
		return !this.hasDetails ? undefined : window.getComputedStyle(this).getPropertyValue('--mo-data-grid-column-details-width')
	}

	get selectionColumnWidth() {
		return !this.hasSelection ? undefined : window.getComputedStyle(this).getPropertyValue('--mo-data-grid-column-selection-width')
	}

	get dataColumnsWidths() {
		return this.visibleColumns
			.map(c => c.width)
			.filter((c): c is string => c !== undefined)
	}

	get moreColumnWidth() {
		return this.sidePanelHidden && !this.hasContextMenu ? undefined : window.getComputedStyle(this).getPropertyValue('--mo-data-grid-column-more-width')
	}

	// eslint-disable-next-line @typescript-eslint/member-ordering
	private lastScrollElementTop = 0
	private readonly handleScroll = (e: Event) => {
		if (this.preventFabCollapse === false) {
			if (!e.composed) {
				e.preventDefault()
				e.target?.dispatchEvent(new Event('scroll', { composed: true, bubbles: true }))

				if (this.hasFabs) {
					const targetElement = e.composedPath()[0] as HTMLElement
					const scrollTop = targetElement.scrollTop
					const isUpScrolling = scrollTop <= this.lastScrollElementTop
					this.fabSlotCollapsed = !isUpScrolling
					this.lastScrollElementTop = scrollTop <= 0 ? 0 : scrollTop
				}
			}
		}
	}

	protected get sortedData() {
		const sorting = this.sorting

		if (!sorting) {
			return this.data
		}

		const dataClone = [...this.data]

		switch (sorting.strategy) {
			case DataGridSortingStrategy.Ascending:
				return dataClone.sort((a, b) => getValueByKeyPath(a, sorting.selector) > getValueByKeyPath(b, sorting.selector) ? 1 : -1)
			case DataGridSortingStrategy.Descending:
				return dataClone.sort((a, b) => getValueByKeyPath(a, sorting.selector) < getValueByKeyPath(b, sorting.selector) ? 1 : -1)

		}
	}

	get renderData() {
		if (this.hasPagination === false) {
			return this.sortedData
		}
		const from = (this.page - 1) * this.pageSize
		const to = this.page * this.pageSize
		return this.sortedData.slice(from, to)
	}

	private get elementExtractedColumns(): Array<ColumnDefinition<TData, KeyPathValueOf<TData>>> {
		if (!this.columnsSlot) {
			return []
		}
		const children = this.columnsSlot.children.length > 0 ? Array.from(this.columnsSlot.children) : undefined
		const assigned = this.columnsSlot.assignedElements().length > 0 ? Array.from(this.columnsSlot.assignedElements()) : undefined
		return Array.from(assigned ?? children ?? [])
			.filter((c): c is DataGridColumn<TData, KeyPathValueOf<TData>> => {
				const isColumn = c instanceof DataGridColumn
				if (isColumn) {
					c.dataGrid = this
				}
				return isColumn
			})
			.map(c => c.definition)
	}

	private get autoGeneratedColumns() {
		if (!this.dataLength) {
			return []
		}

		const getDefaultColumnElement = (value: unknown) => {
			switch (typeof value) {
				case 'number':
				case 'bigint':
					return 'mo-data-grid-column-number'
				case 'boolean':
					return 'mo-data-grid-column-boolean'
				default:
					return 'mo-data-grid-column-text'
			}
		}
		const sampleData = this.data[0]
		return Object.keys(sampleData!)
			.filter(key => !key.startsWith('_'))
			.map(key => {
				const columnElement = document.createElement(getDefaultColumnElement(getValueByKeyPath(sampleData, key as any)))
				columnElement.remove()
				return {
					heading: key.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() + key.replace(/([A-Z])/g, ' $1').slice(1),
					dataSelector: key as KeyPathOf<TData>,
					width: '1fr',
					hidden: false,
					getContentTemplate: columnElement.getContentTemplate.bind(columnElement),
					getEditContentTemplate: columnElement.getEditContentTemplate.bind(columnElement),
				}
			}) as Array<ColumnDefinition<TData>>
	}

	get visibleColumns() {
		return this.columns.filter(c => c.hidden === false)
	}

	get previouslySelectedData() {
		const hasId = this.selectedData.every(d => Object.keys(d as any).includes('id'))
		if (hasId) {
			const selectedIds = this.selectedData.map((d: any) => d.id) as Array<number>
			return this.data.filter((d: any) => selectedIds.includes(d.id))
		} else {
			const selectedDataJson = this.selectedData.map(d => JSON.stringify(d))
			return this.data.filter(d => selectedDataJson.includes(JSON.stringify(d)))
		}
	}
}

function subDataGridSelectorChanged<TData>(this: DataGrid<TData>) {
	const selector = this.subDataGridDataSelector

	if (selector === undefined || !!this.getRowDetailsTemplate) {
		return
	}

	this.getRowDetailsTemplate = (data: TData) => html`
		<mo-data-grid ${style({ padding: '0px' })}
			.data=${getValueByKeyPath(data, selector)}
			headerHidden
			sidePanelHidden
			.columns=${this.columns}
			.subDataGridDataSelector=${this.subDataGridDataSelector}
			.selectionMode=${this.selectionMode}
			.isDataSelectable=${this.isDataSelectable}
			?selectOnClick=${this.selectOnClick}
			?primaryContextMenuItemOnDoubleClick=${this.primaryContextMenuItemOnDoubleClick}
			?multipleDetails=${this.multipleDetails}
			?detailsOnClick=${this.detailsOnClick}
			.getRowContextMenuTemplate=${this.getRowContextMenuTemplate}
			editability=${this.editability}
			@rowConnected=${(e: CustomEvent<DataGridRow<TData, undefined>>) => this.rowConnected.dispatch(e.detail)}
			@rowDisconnected=${(e: CustomEvent<DataGridRow<TData, undefined>>) => this.rowDisconnected.dispatch(e.detail)}
			@rowClick=${(e: CustomEvent<DataGridRow<TData, undefined>>) => this.rowClick.dispatch(e.detail)}
			@rowDoubleClick=${(e: CustomEvent<DataGridRow<TData, undefined>>) => this.rowDoubleClick.dispatch(e.detail)}
			@rowDetailsOpen=${(e: CustomEvent<DataGridRow<TData, undefined>>) => this.rowDetailsOpen.dispatch(e.detail)}
			@rowDetailsClose=${(e: CustomEvent<DataGridRow<TData, undefined>>) => this.rowDetailsClose.dispatch(e.detail)}
			@rowEdit=${(e: CustomEvent<DataGridRow<TData, undefined>>) => this.rowEdit.dispatch(e.detail)}
			@cellEdit=${(e: CustomEvent<DataGridCell<any, TData, undefined>>) => this.cellEdit.dispatch(e.detail)}
		></mo-data-grid>
	`
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-data-grid': DataGrid<unknown, undefined>
	}
}