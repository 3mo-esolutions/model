import { Component, event, html, ifDefined, property, PropertyValues, css, nothing, style } from '@a11d/lit'
import { FieldPairMode, DialogLanguageField, Language, Field } from '../../input'

/**
 * @fires change
 * @fires languageChange
 * @fires languagesFetch
 */
export abstract class LanguageField<TLanguage extends Language, TField extends Field<T | undefined>, T> extends Component {
	@event() readonly change!: EventDispatcher<Map<TLanguage[keyof TLanguage], T | undefined>>
	@event() readonly languageChange!: EventDispatcher<TLanguage>
	@event() readonly languagesFetch!: EventDispatcher<Array<TLanguage>>

	@property() mode = FieldPairMode.Attach
	@property() valueKey: keyof TLanguage = 'id'
	@property({ type: Object }) value = new Map<TLanguage[keyof TLanguage], T | undefined>()
	@property({ type: Object }) defaultLanguage?: TLanguage
	@property({ type: Object }) selectedLanguage?: TLanguage

	private languages = new Array<TLanguage>()

	protected abstract fetch(): Promise<Array<TLanguage>>

	get fieldElement() { return this.children[0] as TField }

	protected override initialized() {
		this.fieldElement.change.subscribe(this.handleFieldChange)
		this.fetchLanguages()
	}

	protected override disconnected() {
		this.fieldElement.change.unsubscribe(this.handleFieldChange)
	}

	protected async fetchLanguages() {
		this.languages = await this.fetch()
		this.selectedLanguage = this.languages[0]
		this.defaultLanguage = this.languages[0]
		this.languagesFetch.dispatch(this.languages)
	}

	private readonly handleFieldChange = (value?: T) => {
		if (!this.selectedLanguage) {
			return
		}

		this.value.set(this.selectedLanguage[this.valueKey], value)

		const applyDefaultLanguageBehaviorIfApplicable = () => {
			if (!!value &&
				this.selectedLanguage === this.defaultLanguage &&
				[...this.value].filter(([key]) => key !== this.defaultLanguage?.[this.valueKey]).every(v => v === undefined)
			) {
				this.languages.forEach(lang => this.value.set(lang[this.valueKey], value))
			}
		}

		applyDefaultLanguageBehaviorIfApplicable()

		this.change.dispatch(this.value)
	}

	protected override update(changedProperties: PropertyValues) {
		super.update(changedProperties)
		this.updateFieldValue()
	}

	static override get styles() {
		return css`
			mo-field-select::part(container) {
				display: none;
			}

			:host([single]) mo-field-select::part(dropDownIcon) {
				display: none;
			}

			:host([single]) mo-field-pair {
				--mo-field-pair-attachment-width: 50px;
			}
		`
	}

	protected override get template() {
		this.switchAttribute('single', this.languages.length === 1)
		return html`
			<mo-field-pair mode=${this.mode} ${style({ height: '100%' })}>
				<slot></slot>
				${this.languageTemplate}
			</mo-field-pair>
		`
	}

	protected get languageTemplate() {
		return html`
			${!this.languages.length ? nothing : html`
				<mo-field-select slot=${this.languageSelectFieldSlotName} label=''
					.data=${this.selectedLanguage}
					@dataChange=${this.handleLanguageChange}
				>
					${this.languages.length === 1 ? nothing : html`<mo-icon-button slot='leading' icon='launch' ${style({ display: 'flex', alignItems: 'center' })} @click=${this.openDialog}></mo-icon-button>`}
					<img slot='leading' src=${ifDefined(this.flagPath)} style='width: 30px'>
					${this.languages.map((language, index) => html`
						<mo-option value=${language.code} .data=${language} ?selected=${index === 0} graphic='avatar'>
							<img src=${this.getFlagPath(language)} slot='graphic' style='width:30px'>
							${language.name}
						</mo-option>
					`)}
				</mo-field-select>
			`}
		`
	}

	protected get languageSelectFieldSlotName() {
		return 'attachment'
	}

	private getFlagPath(language: Language) {
		return `/assets/images/flags/${language.code}.svg`
	}

	private get flagPath() {
		return this.selectedLanguage ? this.getFlagPath(this.selectedLanguage) : undefined
	}

	private readonly handleLanguageChange = (e: CustomEvent<TLanguage>) => {
		this.selectedLanguage = e.detail
		this.languageChange.dispatch(this.selectedLanguage)
		this.updateFieldValue()
	}

	protected updateFieldValue() {
		if (this.selectedLanguage) {
			this.fieldElement.value = this.value.get(this.selectedLanguage[this.valueKey])
		}
	}

	private readonly openDialog = async () => {
		await new DialogLanguageField({ languageField: this }).confirm()
		this.change.dispatch(this.value)
	}
}