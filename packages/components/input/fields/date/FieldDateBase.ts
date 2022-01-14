
import { html, nothing, property, renderContainer } from '../../../../library'
import { Field } from '../../Field'

export abstract class FieldDateBase<T> extends Field<T> {
	@property({ type: Boolean, reflect: true }) open = false
	@property({ type: Boolean }) hideDatePicker = false
	@property({ type: Object }) shortcutReferenceDate = new MoDate

	protected get calendarDate() { return new MoDate }
	protected set calendarDate(_value) { this.open = false }

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
					.value=${this.calendarDate}
					@change=${(e: CustomEvent<MoDate>) => this.calendarDate = e.detail}
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
}