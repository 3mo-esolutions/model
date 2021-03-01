
import { component, html, nothing, property, renderContainer } from '../../../library'
import { FormatHelper } from '../../../helpers'
import { Field } from '../Field'

@component('mo-field-date')
export class FieldDate extends Field<Date | undefined> {
	@property({ type: Boolean, reflect: true }) open = false
	@property({ type: Boolean }) hideDatePicker = false

	// For lit-analyzer to solve generic error
	@property({ type: Object })
	get value() { return super.value }
	set value(value) { super.value = value }

	protected render() {
		return html`
			${super.render()}
			<mo-menu
				?hidden=${this.hideDatePicker}
				?open=${this.open}
				id='menuCalendar'
				style='--mdc-theme-surface: var(--mo-color-background);'
				fixed
				.anchor=${this}
				corner='BOTTOM_START'
				@closed=${() => this.open = false}
				@opened=${() => this.open = true}>
				<mo-calendar
					.value=${new MoDate(this.value ?? new Date)}
					@change=${(e: CustomEvent<MoDate>) => this.selectDate(e.detail)}
				></mo-calendar>
			</mo-menu>
		`
	}

	@renderContainer('slot[name="trailing"]')
	protected get dataIconButtonTemplate() {
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
		this.value = date
		this.open = false
		this.change.trigger(date)
	}

	protected fromValue(value: Date | undefined): string {
		return value ? FormatHelper.date(value) ?? '' : ''
	}

	protected toValue(value: string): Date | undefined {
		value = value.toLowerCase()

		if (!value)
			return undefined

		if (value.includes(FormatHelper.Date.Separator.value))
			return this.calculateDateFromLocalDate(value)

		if (value.charAt(0) === '+' || value.charAt(0) === '-')
			return this.calculateDateFromOperation(value)

		if ((value.length === 3 || value.length === 4 || value.length === 8) && !isNaN(parseInt(value)))
			return this.calculateDateFromShortcut(value)

		const keywordDate = this.calculateDateFromKeyword(value)
		if (keywordDate)
			return keywordDate

		return new Date(value ?? new Date)
	}

	private calculateDateFromLocalDate(string: string) {
		const dateArr = string.split(FormatHelper.Date.Separator.value)

		if (dateArr.length === 2)
			return new Date(new Date().getFullYear(), parseInt(dateArr[1]) - 1, parseInt(dateArr[0]))

		if (dateArr.length === 3)
			return new Date(parseInt(dateArr[2]), parseInt(dateArr[1]) - 1, parseInt(dateArr[0]))

		return undefined
	}

	private calculateDateFromOperation(string: string) {
		const lastChar = string.charAt(string.length - 1).toLowerCase()
		let num: number

		if (!isNaN(Number(lastChar))) {
			num = parseInt(string.substr(0, string.length))
			return new MoDate().addDay(num)
		} else {
			num = parseInt(string.substr(0, string.length - 1))

			switch (lastChar) {
				case 'y': return new MoDate().addYear(num)
				case 'm': return new MoDate().addMonth(num)
				default: return undefined
			}
		}
	}

	private calculateDateFromShortcut(string: string) {
		const day = string.substring(0, 2)
		const month = string.substring(2, string.length >= 4 ? 4 : 3)
		let year = undefined
		if (string.length === 8) year = string.substring(4, 8)
		const date = new MoDate(year ? parseInt(year) : new Date().getFullYear(), parseInt(month) - 1, parseInt(day))
		return date
	}

	private calculateDateFromKeyword(keyword: string) {
		switch (keyword) {
			case 'h': return new MoDate()
			case 'üm': return new MoDate().addDay(+2)
			case 'm': return new MoDate().addDay(+1)
			case 'üüm': return new MoDate().addDay(+3)
			case 'g': return new MoDate().addDay(-1)
			case 'vg': return new MoDate().addDay(-2)
			case 'vvg': return new MoDate().addDay(-3)
			case 'adw': return new MoDate().weekStart
			case 'edw': return new MoDate().weekEnd
			case 'adm': return new MoDate().monthStart
			case 'edm': return new MoDate().monthEnd
			case 'adj': return new MoDate().yearStart
			case 'edj': return new MoDate().yearEnd
		}
		return undefined
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-date': FieldDate
	}
}