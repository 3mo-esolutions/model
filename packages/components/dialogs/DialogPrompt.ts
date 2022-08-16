import { state, component, html, ifDefined, query } from '../../library'
import { FieldText, FieldTextArea } from '..'
import { DialogComponent } from '../../shell'
import { BaseDialogParameters } from './BaseDialogParameters'
import { Localizer } from '../..'

Localizer.register(LanguageCode.German, {
	'OK': 'OK',
	'Cancel': 'Abbrechen',
	'Apply': 'Übernehmen',
	'Input': 'Eingabe'
})

type Parameters = BaseDialogParameters & {
	readonly inputLabel?: string
	readonly value?: string
	readonly isTextArea?: boolean
}

@component('mo-dialog-prompt')
export class DialogPrompt extends DialogComponent<Parameters, string> {
	@state() private value = this.parameters.value ?? ''

	@query('#inputElement') readonly inputElement!: FieldText | FieldTextArea

	protected override get template() {
		return html`
			<mo-dialog
				heading=${this.parameters.heading}
				primaryButtonText=${this.parameters.primaryButtonText ?? _('Apply')}
				?blocking=${this.parameters.blocking}
				size=${ifDefined(this.parameters.size)}
				primaryOnEnter
			>
				<mo-flex width='100%' height='100%' gap='var(--mo-thickness-m)'>
					${this.parameters.content}
					${this.textFieldTemplate}
				</mo-flex>
			</mo-dialog>
		`
	}

	private get textFieldTemplate() {
		return this.parameters.isTextArea ? html`
			<mo-field-text-area id='inputElement' data-focus
				label=${this.parameters.inputLabel ?? _('Input')}
				value=${this.value}
				@input=${(e: CustomEvent<string>) => this.value = e.detail}
			></mo-field-text-area>
		` : html`
			<mo-field-text id='inputElement' data-focus
				label=${this.parameters.inputLabel ?? _('Input')}
				value=${this.value}
				@input=${(e: CustomEvent<string>) => this.value = e.detail}
			></mo-field-text>
		`
	}

	protected override primaryAction = () => this.value
}