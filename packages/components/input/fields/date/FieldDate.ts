
import { component, html, nothing, property, renderContainer } from '../../../../library'
import { FormatHelper, DateHelper } from '../../../..'
import { Field } from '../../Field'

@component('mo-field-date')
export class FieldDate extends Field<Date | undefined> {
	@property({ type: Boolean, reflect: true }) open = false
	@property({ type: Boolean }) hideDatePicker = false
	@property({ type: Object }) shortcutReferenceDate = new MoDate

	// For lit-analyzer to solve generic error
	@property({ type: Object })
	override get value() { return super.value }
	override set value(value) { super.value = value }

	protected override get template() {
		return html`
			${super.template}
			<mo-menu
				?hidden=${this.hideDatePicker}
				?open=${this.open}
				style='--mdc-theme-surface: var(--mo-color-background)'
				fixed
				.anchor=${this as any}
				corner='BOTTOM_START'
				@closed=${() => this.open = false}
				@opened=${() => this.open = true}
			>
				<mo-calendar
					.value=${new MoDate(this.value ?? new Date)}
					@change=${(e: CustomEvent<MoDate>) => this.selectDate(e.detail)}
				></mo-calendar>
			</mo-menu>
		`
	}

	@renderContainer('slot[name="trailingInternal"]')
	protected get calendarIconButtonTemplate() {
		return this.hideDatePicker ? nothing : html`
			<mo-icon-button
				tabindex='-1'
				small icon='today'
				foreground=${this.open ? 'var(--mo-accent)' : ''}
				@click=${() => this.open = !this.open}>
			</mo-icon-button>
		`
	}

	private selectDate(date: Date) {
		this.open = false
		this.value = date
		this.change.dispatch(date)
	}

	protected fromValue(value: Date | undefined) {
		return value ? FormatHelper.date(value) ?? '' : ''
	}

	protected toValue(value: string) {
		return value ? DateHelper.parseDateFromText(value) : undefined
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-date': FieldDate
	}
}