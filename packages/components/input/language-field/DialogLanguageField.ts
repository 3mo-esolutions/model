import { component, html, state } from '@a11d/lit'
import { LanguageField, Language, Field } from '../..'
import { DialogComponent } from '@a11d/lit-application'

@component('mo-dialog-language-field')
export class DialogLanguageField<TLanguage extends Language, TField extends Field<T | undefined>, T> extends DialogComponent<{ readonly languageField: LanguageField<TLanguage, TField, T> }> {
	@state() private readonly value = new Map<TLanguage[keyof TLanguage], T | undefined>(this.parameters.languageField.value)

	protected override get template() {
		return html`
			<mo-dialog heading=${this.parameters.languageField.fieldElement.label} primaryButtonText='Übernehmen'>
				<style>
					mo-flex {
						padding: var(--mo-thickness-m) 0;
					}

					mo-flex > img {
						padding-right: var(--mo-thickness-m);
					}
				</style>
				${this.parameters.languageField['languages'].map(language => html`
					<mo-flex direction='horizontal'>
						<img src='/assets/images/flags/${language.code}.svg' style='width: 30px; margin-top: 3px;'>
						${this.getFieldTemplate(language)}
					</mo-flex>
				`)}
			</mo-dialog>
		`
	}

	private readonly getFieldTemplate = (language: TLanguage) => {
		const field = this.parameters.languageField.fieldElement.cloneNode(true) as TField
		field.value = this.parameters.languageField.value.get(language[this.parameters.languageField.valueKey])
		field.style.flex = '1'
		field.change.subscribe(value => this.value.set(language[this.parameters.languageField.valueKey], value))
		return field
	}

	protected override primaryAction = () => {
		this.parameters.languageField.value = this.value
	}
}