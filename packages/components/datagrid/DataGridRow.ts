import { nothing, css, property, component, Component, html, state, queryAll } from '../../library'
import { ContextMenuHost } from '../../shell'
import { KeyboardHelper } from '../../utilities'
import { ColumnDefinition } from './ColumnDefinition'
import { DataGrid, DataGridCell, DataGridEditability, DataGridPrimaryContextMenuItem, DataGridSelectionMode } from '.'

@component('mo-data-grid-row')
export class DataGridRow<TData, TDetailsElement extends Element | undefined = undefined> extends Component {
	@queryAll('mo-data-grid-cell') readonly cells!: Array<DataGridCell<any, TData, TDetailsElement>>

	@property({ type: Object }) dataGrid!: DataGrid<TData, TDetailsElement>
	@property({ type: Object }) data!: TData
	@property({ type: Boolean, reflect: true }) selected = false
	@property({ type: Boolean, reflect: true }) detailsOpen = false
	@state() private editing = false

	get detailsElement() {
		return this.renderRoot.querySelector('#details')?.firstElementChild as TDetailsElement as TDetailsElement | undefined
	}

	protected override connected() {
		super.connected()
		this.dataGrid.rowConnected.dispatch(this)
	}

	protected override disconnected() {
		super.disconnected()
		this.dataGrid.rowDisconnected.dispatch(this)
	}

	protected override initialized() {
		super.initialized()
		this.editing = this.dataGrid.editability === DataGridEditability.Always
	}

	override updated(...parameters: Parameters<Component['updated']>) {
		this.cells.forEach(cell => cell.requestUpdate())
		super.updated(...parameters)
	}

	private get hasDetails() {
		if (this.dataGrid.subDataGridDataSelector) {
			return Array.isArray(getPropertyByKeyPath(this.data, this.dataGrid.subDataGridDataSelector))
		}

		return this.dataGrid.hasDetails
	}

	static override get styles() {
		return css`
			:host {
				display: block;
				position: relative;
				height: auto;
				width: 100%;
			}

			:host(:hover) {
				color: inherit;
				background: var(--mo-accent-transparent) !important;
			}

			:host(:hover) mo-grid::before, #details::before {
				content: '';
				width: 2px;
				height: 100%;
				top: 0;
				left: 0;
				position: absolute;
				background-color: var(--mo-accent);
			}

			mo-grid {
				height: var(--mo-data-grid-row-height);
				cursor: pointer;
				transition: var(--mo-duration-quick);
			}

			:host([detailsOpen]) mo-grid {
				background: var(--mo-data-grid-row-background-on-opened-detail-element, var(--mo-accent-transparent));
			}

			:host([selected]) mo-grid {
				background: var(--mo-data-grid-selection-background) !important;
			}

			:host([selected]:not(:last-of-type)) mo-grid:after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				border-bottom: 1px solid var(--mo-color-gray-transparent);
			}

			#iconMore {
				transition: var(--mo-duration-quick);
				opacity: 0;
				color: var(--mo-accent);
			}

			:host([selected]) #iconMore {
				color: var(--mo-color-foreground);
			}

			mo-grid:hover #iconMore {
				opacity: 1;
			}

			mo-flex {
				justify-content: center;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}

			#iconDetails {
				transition: var(--mo-duration-quick);
			}

			#iconDetails:hover {
				color: var(--mo-accent);
			}

			:host([detailsOpen]) #iconDetails {
				transform: rotate(90deg);
			}

			#details {
				display: inline-block;
				padding: 0;
				width: 100%;
			}

			#details:empty {
				display: none;
			}

			#details > :first-child {
				padding: var(--mo-thickness-l) 0;
			}

			/* Tree-view borders
				#details [mo-data-grid]::before {
					content: '';
					width: 2px;
					height: calc(100% - var(--mo-details-data-grid-left-margin) + 5px - calc(var(--mo-data-grid-row-height)));
					top: calc(var(--mo-data-grid-row-height) / 2 + 3px);
					position: absolute;
					background-color: var(--mo-color-gray-alpha-1);
					/* Because of the background color of rows
					z-index: 1;
				}

				:host([isSubRow]) mo-grid::before {
					content: '';
					width: var(--mo-data-grid-row-tree-line-width, 8px);
					border-top: 2px solid var(--mo-color-gray);
					margin-left: calc(var(--mo-details-data-grid-left-margin) * -1);
					position: absolute;
					top: calc(50% - 1px);
					height: 0px;
				}
			*/
		`
	}

	protected override get template() {
		return html`
			<mo-grid columns='var(--mo-data-grid-columns)' columnGap='var(--mo-data-grid-columns-gap)'
				@click=${this.handleContentClick}
				@dblclick=${this.handleContentDoubleClick}
				@contextmenu=${this.openContextMenu}
			>
				${this.detailsExpanderTemplate}
				${this.selectionTemplate}
				${this.dataGrid.columns.filter(column => column.hidden === false).map(column => this.getCellTemplate(column as any))}
				${this.contextMenuTemplate}
			</mo-grid>
			<slot id='details'>${this.detailsOpen ? this.detailsTemplate : nothing}</slot>
		`
	}

	private get detailsExpanderTemplate() {
		return html`
			<mo-flex justifyContent='center' alignItems='center' width='var(--mo-data-grid-column-details-width)'
				?hidden=${this.dataGrid.hasDetails === false}
				@click=${(e: Event) => e.stopPropagation()}
				@dblclick=${(e: Event) => e.stopPropagation()}
			>
				<mo-icon-button id='iconDetails' icon='keyboard_arrow_right' foreground='var(--mo-color-foreground)'
					?hidden=${this.hasDetails === false}
					?disabled=${this.dataGrid.hasDataDetail?.(this.data) === false}
					@click=${() => this.toggleDetails()}
				></mo-icon-button>
			</mo-flex>
		`
	}

	private get selectionTemplate() {
		return html`
			<mo-flex height='var(--mo-data-grid-row-height)' width='var(--mo-data-grid-column-selection-width)' justifyContent='center' alignItems='center'
				?hidden=${this.dataGrid.hasSelection === false}
				@click=${(e: Event) => e.stopPropagation()}
				@dblclick=${(e: Event) => e.stopPropagation()}
			>
				<mo-checkbox
					?disabled=${this.dataGrid.isDataSelectable?.(this.data) === false}
					?checked=${this.selected}
					@change=${(e: CustomEvent<CheckboxValue>) => this.setSelection(e.detail === 'checked')}
				></mo-checkbox>
			</mo-flex>
		`
	}

	private getCellTemplate(column: ColumnDefinition<TData, KeyPathValueOf<TData, KeyPathOf<TData>>>) {
		return column.hidden ? nothing : html`
			<mo-data-grid-cell
				?editing=${this.editing}
				.row=${this as any}
				.column=${column}
				.value=${getPropertyByKeyPath(this.data, column.dataSelector as any)}
			></mo-data-grid-cell>
		`
	}

	private get contextMenuTemplate() {
		return html`
			<mo-flex justifyContent='center' alignItems='center'
				?hidden=${this.dataGrid.hasContextMenu === false}
				@click=${this.openContextMenu}
				@dblclick=${(e: Event) => e.stopPropagation()}
			>
				<mo-icon-button id='iconMore' icon='more_vert'></mo-icon-button>
			</mo-flex>
		`
	}

	private get detailsTemplate() {
		return !this.hasDetails
			? nothing
			: this.dataGrid.getRowDetailsTemplate?.(this.data)
			?? nothing
	}

	private setSelection(value: boolean) {
		if (this.dataGrid.hasSelection && this.dataGrid.isSelectable(this.data)) {
			this.selected = value

			const lastActiveSelection = this.dataGrid.lastActiveSelection
			let dataToSelect = this.dataGrid.selectedData

			if (this.dataGrid.selectionMode === DataGridSelectionMode.Multiple && KeyboardHelper.shift && lastActiveSelection) {
				const indexes = [
					this.dataGrid.data.findIndex(data => data === lastActiveSelection.data),
					this.dataGrid.data.findIndex(data => data === this.data),
				].sort((a, b) => a - b)
				const range = this.dataGrid.data.slice(indexes[0]!, indexes[1]! + 1)
				dataToSelect = lastActiveSelection.selected
					? [...dataToSelect, ...range]
					: dataToSelect.filter(d => range.includes(d) === false)
			} else {
				if (value) {
					if (this.dataGrid.selectionMode === DataGridSelectionMode.Multiple) {
						dataToSelect = [...dataToSelect, this.data]
					} else if (this.dataGrid.selectionMode === DataGridSelectionMode.Single) {
						dataToSelect = [this.data]
					}
				} else {
					dataToSelect = dataToSelect.filter(data => data !== this.data)
				}
			}

			this.dataGrid.lastActiveSelection = { data: this.data, selected: value }

			this.dataGrid.select(dataToSelect.filter((value, index, self) => self.indexOf(value) === index))
		}
	}

	private readonly handleContentClick = () => {
		if (this.dataGrid.selectOnClick && this.dataGrid.editability !== DataGridEditability.OnRowClick) {
			this.setSelection(!this.selected)
		}

		if (this.dataGrid.detailsOnClick === true && this.dataGrid.editability !== DataGridEditability.OnRowClick) {
			this.toggleDetails()
		}

		if (this.dataGrid.editability === DataGridEditability.OnRowClick) {
			this.enableEditMode()
		}

		this.dataGrid.rowClick.dispatch(this)
	}

	// eslint-disable-next-line @typescript-eslint/member-ordering
	private dataBeforeEdit?: string

	private enableEditMode() {
		this.dataBeforeEdit = JSON.stringify(this.data)
		this.editing = true
		window.addEventListener('click', this.handleClick)
	}

	private readonly handleClick = (e: MouseEvent) => {
		if (e.composedPath().includes(this) === false) {
			const dataAfterEdit = JSON.stringify(this.data)
			if (dataAfterEdit !== this.dataBeforeEdit) {
				this.dataGrid.rowEdit.dispatch(this)
			}
			window.removeEventListener('click', this.handleClick)
			this.editing = false
		}
	}

	private readonly handleContentDoubleClick = async () => {
		if (this.dataGrid.primaryContextMenuItemOnDoubleClick === true && this.dataGrid.hasContextMenu === true && this.dataGrid.selectionMode === DataGridSelectionMode.None) {
			await this.openContextMenu()
			ContextMenuHost.instance.items.find(item => item instanceof DataGridPrimaryContextMenuItem)?.click()
			await this.closeContextMenu()
		}

		this.dataGrid.rowDoubleClick.dispatch(this)
	}

	openContextMenu = async (mouseEvent?: MouseEvent) => {
		mouseEvent?.stopPropagation()

		if (this.dataGrid.getRowContextMenuTemplate === undefined) {
			return
		}

		if (this.dataGrid.selectedData.includes(this.data) === false) {
			this.dataGrid.select(this.dataGrid.selectionMode !== DataGridSelectionMode.None ? [this.data] : [])
		}

		const contextMenuData = this.dataGrid.selectionMode === DataGridSelectionMode.None
			? [this.data]
			: this.dataGrid.selectedData.length === 0
				? [this.data]
				: this.dataGrid.selectedData

		const contextMenuTemplate = this.dataGrid.getRowContextMenuTemplate(contextMenuData)

		await ContextMenuHost.open(...(mouseEvent
			? [mouseEvent, contextMenuTemplate]
			: [[this.clientLeft, this.clientTop], contextMenuTemplate]
		))
	}

	async closeContextMenu() {
		await ContextMenuHost.close()
	}

	async setDetails(value: boolean) {
		if (this.hasDetails) {
			if (value === true && this.dataGrid.multipleDetails === false) {
				await this.dataGrid.closeRowDetails()
			}
			this.detailsOpen = value
			await this.updateComplete;
			(value ? this.dataGrid.rowDetailsOpen : this.dataGrid.rowDetailsClose).dispatch(this)
		}
	}

	private async toggleDetails() {
		await this.setDetails(!this.detailsOpen)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-data-grid-row': DataGridRow<unknown>
	}
}