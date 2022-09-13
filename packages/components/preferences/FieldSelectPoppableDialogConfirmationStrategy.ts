import { component, html } from '../../library'
import { DialogComponent, DialogConfirmationStrategy } from '../../shell'
import { FieldFetchableSelect } from '../input'

@component('mo-field-select-poppable-dialog-confirmation-strategy')
export class FieldSelectPoppableDialogConfirmationStrategy extends FieldFetchableSelect<DialogConfirmationStrategy> {
	private static readonly labelByData = new Map([
		[DialogConfirmationStrategy.Dialog, 'als Dialog'],
		[DialogConfirmationStrategy.Tab, 'in neuem Tab'],
		[DialogConfirmationStrategy.Window, 'in neuem Fenster'],
	])

	protected override fetchData() {
		return Promise.resolve([...FieldSelectPoppableDialogConfirmationStrategy.labelByData.keys()])
	}

	protected override getOptionTemplate(strategy: DialogConfirmationStrategy) {
		return html`
			<mo-option value=${strategy}>${FieldSelectPoppableDialogConfirmationStrategy.labelByData.get(strategy)}</mo-option>
		`
	}

	protected override initialized() {
		super.initialized()
		this.value = DialogComponent.poppableConfirmationStrategy.value
		this.change.subscribe(strategy => DialogComponent.poppableConfirmationStrategy.value = Number(strategy) as DialogConfirmationStrategy)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-select-poppable-dialog-confirmation-strategy': FieldSelectPoppableDialogConfirmationStrategy
	}
}