import { property, TemplateResult } from '@a11d/lit'
import { DataGridColumn } from '.'

export abstract class DataGridColumnNumberBase<TData> extends DataGridColumn<TData, number> {
	@property() sumHeading: string | undefined = undefined
	@property() override textAlign = 'right'

	override get definition() {
		return {
			...super.definition,
			sumHeading: this.sumHeading,
			getSumTemplate: this.getSumTemplate.bind(this),
		}
	}

	abstract getSumTemplate(sum: number): TemplateResult<1>
}