
import { html, live, nothing, property, query, style } from '@a11d/lit'
import { InputFieldComponent } from '@3mo/field'
import { MaterialIcon } from '@3mo/icon'
import { CalendarSelectionAdapter, SelectableCalendar } from '../../calendar'

/**
 * @attr open - Whether the date picker is open
 * @attr hideDatePicker - Hide the date picker
 * @attr shortcutReferenceDate - The date to use as a reference for shortcuts
 */
export abstract class FieldDateBase<T> extends InputFieldComponent<T> {
	@property({ type: Boolean, reflect: true }) open = false
	@property({ type: Boolean }) hideDatePicker = false
	@property({ type: Object }) shortcutReferenceDate = new MoDate

	@query('mo-selectable-calendar') protected readonly calendarElement?: SelectableCalendar<T>

	protected readonly abstract calendarSelectionAdapterConstructor: Constructor<CalendarSelectionAdapter<T>>

	protected override get endSlotTemplate() {
		return html`
			${super.endSlotTemplate}
			${this.calendarIconButtonTemplate}
		`
	}

	protected override handleChange(value?: T, e?: Event) {
		super.handleChange(value, e)
		this.inputStringValue = this.fromValue(value)
	}

	protected override get inputTemplate() {
		return html`
			<input
				part='input'
				?readonly=${this.readonly}
				?required=${this.required}
				?disabled=${this.disabled}
				.value=${live(this.inputStringValue || '')}
				@input=${(e: Event) => this.handleInput(this.toValue(this.inputElement.value || ''), e)}
				@change=${(e: Event) => this.handleChange(this.toValue(this.inputElement.value || ''), e)}
			>
		`
	}

	protected abstract toValue(value: string): T | undefined
	protected abstract fromValue(value: T | undefined): string

	protected get calendarIconButtonTemplate() {
		return html`
			<div>
				${this.hideDatePicker ? nothing : html`
					<mo-icon-button tabindex='-1' dense
						icon=${this.calendarIconButtonIcon}
						${style({ color: this.open ? 'var(--mo-color-accent)' : 'var(--mo-color-gray)' })}
						@click=${() => this.open = !this.open}>
					</mo-icon-button>
				`}

				${this.hideDatePicker ? nothing : html`
					<mo-deprecated-menu
						?open=${this.open}
						style='--mdc-theme-surface: var(--mo-color-background)'
						fixed
						.anchor=${this as any}
						corner='BOTTOM_START'
						@closed=${() => this.open = false}
						@opened=${() => this.open = true}
					>${!this.open ? nothing : this.menuContentTemplate}</mo-deprecated-menu>
				`}
			</div>
		`
	}

	protected get menuContentTemplate() {
		return html`
			<mo-selectable-calendar
				.selectionAdapterConstructor=${this.calendarSelectionAdapterConstructor}
				.value=${this.value}
				@change=${(e: CustomEvent<T>) => this.handleCalendarChange(e.detail)}
			></mo-selectable-calendar>
		`
	}

	protected readonly calendarIconButtonIcon: MaterialIcon = 'today'

	protected handleCalendarChange(value: T) {
		this.value = value
		this.change.dispatch(value)
	}
}