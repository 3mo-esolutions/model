import { Component, property, HTMLTemplateResult, AsteriskSyntaxStyleHandler } from '@a11d/lit'
import { ColumnDefinition } from '../ColumnDefinition'
import { DataGrid } from '../DataGrid'

export abstract class DataGridColumn<TData, TValue> extends Component {
	@property({ type: Object }) dataGrid?: DataGrid<TData, any> | undefined

	@property() width = 'minmax(100px, 1fr)'
	@property({ type: Boolean }) override hidden = false
	@property({ reflect: true }) heading = ''
	@property({ reflect: true }) textAlign = 'start'
	@property({ reflect: true }) override title!: string
	@property({ reflect: true }) dataSelector!: KeyPathOf<TData>
	@property({ type: Boolean, reflect: true }) nonSortable = false
	@property({ type: Boolean, reflect: true }) nonEditable = false

	get definition(): ColumnDefinition<TData, TValue> {
		return {
			dataSelector: this.dataSelector,
			heading: this.heading,
			title: this.title || undefined,
			alignment: this.textAlign as 'left' | 'center' | 'right',
			hidden: this.hidden,
			width: !AsteriskSyntaxStyleHandler.regex.test(this.width) ? this.width : `${AsteriskSyntaxStyleHandler.getProportion(this.width)}fr`,
			sortable: !this.nonSortable,
			editable: !this.nonEditable,
			getContentTemplate: this.getContentTemplate.bind(this),
			getEditContentTemplate: this.getEditContentTemplate.bind(this),
		}
	}

	abstract getContentTemplate(value: TValue | undefined, data: TData): HTMLTemplateResult
	abstract getEditContentTemplate(value: TValue | undefined, data: TData): HTMLTemplateResult

	protected handleEdit(value: TValue | undefined, data: TData) {
		this.dataGrid?.handleEdit(data, this.dataSelector, value as any)
	}

	override connectedCallback() {
		if (this.parentElement instanceof DataGrid) {
			this.slot = 'column'
		}
		super.connectedCallback()
	}

	protected override updated() {
		this.dataGrid?.extractColumns()
		this.dataGrid?.requestUpdate()
	}
}