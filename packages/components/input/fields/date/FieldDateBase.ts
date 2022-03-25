
import { html, nothing, property, query, renderContainer } from '../../../../library'
import { MaterialIcon } from '../../../helpers'
import { CalendarSelectionAdapter, SelectableCalendar } from '../../calendar'
import { Field } from '../../Field'

export abstract class FieldDateBase<T> extends Field<T> {
	@property({ type: Boolean, reflect: true }) open = false
	@property({ type: Boolean }) hideDatePicker = false
	@property({ type: Object }) shortcutReferenceDate = new MoDate

	@query('mo-selectable-calendar') protected readonly calendarElement?: SelectableCalendar<T>

	protected readonly abstract calendarSelectionAdapterConstructor: Constructor<CalendarSelectionAdapter<T>>

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
			>${!this.open ? nothing : this.menuContentTemplate}</mo-menu>
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

	@renderContainer('slot[name="trailingInternal"]')
	protected get calendarIconButtonTemplate() {
		return this.hideDatePicker ? nothing : html`
			<mo-icon-button tabindex='-1' small icon=${this.calendarIconButtonIcon}
				foreground=${this.open ? 'var(--mo-accent)' : ''}
				@click=${() => this.open = !this.open}>
			</mo-icon-button>
		`
	}

	protected readonly calendarIconButtonIcon: MaterialIcon = 'today'

	protected handleCalendarChange(value: T) {
		this.value = value
		this.change.dispatch(value)
	}
}