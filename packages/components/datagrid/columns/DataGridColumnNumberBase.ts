import { property, TemplateResult } from '../../../library'
import { DataGridColumn } from '.'

export abstract class DataGridColumnNumberBase<TData> extends DataGridColumn<TData, number> {
	@property() sumHeading: string | undefined = undefined

	override get textAlign() { return super.textAlign === '' ? 'right' : super.textAlign }
	override set textAlign(value) { super.textAlign = value }

	override get definition() {
		return {
			...super.definition,
			sumHeading: this.sumHeading,
			getSumTemplate: this.getSumTemplate.bind(this),
		}
	}

	abstract getSumTemplate(sum: number): TemplateResult<1>
}