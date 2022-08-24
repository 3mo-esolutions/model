import { Component, property, CssHelper, HTMLTemplateResult } from '../../../library'
import { ColumnDefinition } from '../ColumnDefinition'
import { DataGrid } from '../DataGrid'

export abstract class DataGridColumn<TData, TValue> extends Component {
	@property({ type: Object }) dataGrid?: DataGrid<TData, any> | undefined

	@property({ reflect: true }) heading = ''
	@property({ reflect: true }) override title!: string
	@property({ reflect: true }) dataSelector!: KeyPathOf<TData>
	@property({ type: Boolean, reflect: true }) nonSortable = false
	@property({ type: Boolean, reflect: true }) nonEditable = false

	@property({ type: Boolean })
	override get hidden() { return super.hidden }
	override set hidden(value: boolean) {
		super.hidden = value
		this.requestUpdate('hidden')
	}

	private _width = 'minmax(100px, 1fr)'
	@property()
	override get width() { return super.width }
	override set width(value: string) {
		this._width = CssHelper.isAsteriskSyntax(value) ? CssHelper.getGridFractionFromAsteriskSyntax(value) : value
		this.requestUpdate('width')
	}

	get definition(): ColumnDefinition<TData, TValue> {
		return {
			dataSelector: this.dataSelector,
			heading: this.heading,
			title: this.title || undefined,
			alignment: this.textAlign as 'left' | 'center' | 'right',
			hidden: this.hidden,
			width: this._width,
			sortable: !this.nonSortable,
			editable: !this.nonEditable,
			getContentTemplate: this.getContentTemplate.bind(this),
			getEditContentTemplate: this.getEditContentTemplate.bind(this),
		}
	}

	abstract getContentTemplate(value: TValue | undefined, data: TData): HTMLTemplateResult
	abstract getEditContentTemplate(value: TValue | undefined, data: TData): HTMLTemplateResult

	protected handleEdit(value: TValue | undefined, data: TData) {
		this.dataGrid
			?.rows.find(row => row.data === data)
			?.cells.find(cell => cell.column.dataSelector === this.dataSelector)
			?.handleEdit(value)
	}

	override connectedCallback() {
		if (this.parentElement instanceof DataGrid) {
			this.slot = 'column'
		}
		super.connectedCallback()
	}

	protected override updated() {
		this.dataGrid?.requestUpdate()
	}
}