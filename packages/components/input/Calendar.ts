import { Component, css, component, html, state, nothing, property, query, event, classMap } from '../../library'
import { Flex } from '..'

/**
 * @fires change {CustomEvent<MoDate>}
 */
@component('mo-calendar')
export class Calendar extends Component {
	@event() readonly change!: EventDispatcher<MoDate>

	@property({ type: Boolean, reflect: true }) includeWeekNumbers = false
	@property({
		type: Object,
		updated(this: Calendar) {
			this.navigatingYear = this.value.year
			this.navigatingMonth = this.value.month
		}
	}) value = new MoDate()

	@state() private navigatingYear = this.value.year
	@state() private navigatingMonth = this.value.month
	@state() private yearSelection = false

	@query('.year.selected') private readonly selectedYearElement!: Flex

	private readonly years = new Array(200).fill(undefined).map((_n, i) => 1901 + i)

	private get navigatingDate() {
		return new MoDate(this.navigatingYear, this.navigatingMonth)
	}

	private previousMonth() {
		if (this.navigatingMonth !== 0) {
			this.navigatingMonth--
			return
		}
		this.navigatingYear--
		this.navigatingMonth = 11
	}

	private nextMonth() {
		if (this.navigatingMonth !== 11) {
			this.navigatingMonth++
			return
		}
		this.navigatingYear++
		this.navigatingMonth = 0
	}

	static override get styles() {
		return css`
			:host {
				--mo-calendar-max-width: 325px;
				--mo-calendar-min-height: 230px;
				--mo-calendar-day-size: 36px;
				--mo-calendar-week-number-width: 0px;
			}

			:host([includeWeekNumbers]) {
				--mo-calendar-week-number-width: var(--mo-calendar-day-size);
			}

			.monthHeader, .week {
				color: var(--mo-color-gray);
			}

			.monthHeader {
				align-items: center;
			}

			:host([includeWeekNumbers]) .monthHeader {
				/* max-width: calc(var(--mo-calendar-max-width) - var(--mo-calendar-week-number-width)); */
				/* margin: 0 0 0 var(--mo-calendar-week-number-width); */
			}

			.navigatingMonth, .navigatingYear {
				font-size: var(--mo-font-size-l);
				transition: var(--mo-duration-medium);
			}

			.navigatingYear:hover {
				color: var(--mo-accent);
				cursor: pointer;
			}

			.day, .year {
				text-align: center;
				border-radius: 100px;
				cursor: pointer;
				transition: var(--mo-duration-quick);
				font-weight: 500;
				user-select: none;
				font-size: var(--mo-font-size-m);
				width: var(--mo-calendar-day-size);
				-webkit-user-select: none;
				align-items: center;
				justify-content: center;
			}

			.year {
				width: 95%;
				justify-content: center;
				align-items: center;
			}

			.day {
				height: var(--mo-calendar-day-size);
			}

			.day:not(.isInMonth) {
				color: var(--mo-color-gray);
			}

			.day:hover, .year:hover {
				background: var(--mo-color-background);
			}
			.day.today:not([selected]) {
				color: var(--mo-accent);
			}

			.selected {
				background: var(--mo-accent) !important;
				color: var(--mo-color-accessible) !important;
			}
		`
	}

	protected override get template() {
		return html`
			<mo-flex width='var(--mo-calendar-max-width)' minHeight='var(--mo-calendar-min-height)' alignItems='center' justifyContent='center'>
				<mo-flex direction='horizontal' justifyContent='space-between' alignItems='center' width='100%'>
					<mo-icon-button icon='keyboard_arrow_left' @click=${() => this.previousMonth()}></mo-icon-button>
					<mo-div>
						<a class='navigatingMonth'>${this.navigatingDate.monthName}</a>
						<a class='navigatingYear' @click=${() => this.toggleYearSelection()}>${this.navigatingYear}</a>
					</mo-div>
					<mo-icon-button icon='keyboard_arrow_right' @click=${() => this.nextMonth()}></mo-icon-button>
				</mo-flex>

				${this.yearSelection ? this.yearSelectionTemplate : this.daySelectionTemplate}
			</mo-flex>
		`
	}

	private get daySelectionTemplate() {
		return html`
			<mo-grid class='month'
				rows='repeat(auto-fill, var(--mo-calendar-day-size))'
				columns=${this.includeWeekNumbers ? 'var(--mo-calendar-week-number-width) repeat(7, var(--mo-calendar-day-size))' : 'repeat(7, var(--mo-calendar-day-size))'}
				alignItems='center'
				justifyItems='center'
			>
				${this.includeWeekNumbers === false ? nothing : html`<mo-div></mo-div>`}

				${MoDate.weekDayNames.map(dayName => html`
					<mo-div class='monthHeader'>
						${dayName.charAt(0).toUpperCase() + dayName.charAt(1)}
					</mo-div>
				`)}

				${this.navigatingDate.monthWeeks.map(([year, weekNumber]) => html`
					${this.includeWeekNumbers === false ? nothing : html`
						<mo-div class='week'>
							${weekNumber}
						</mo-div>
					`}

					${MoDate.getWeekRange([year, weekNumber]).map(day => html`
						<mo-flex
							class=${classMap({ day: true, selected: this.value.equals(day), today: day.equals(new MoDate), isInMonth: day.month === this.navigatingDate.month })}
							@click=${() => this.selectDate(day)}
						>${day.day}</mo-flex>
					`)}
				`)}
			</mo-grid>
		`
	}

	private selectDate(date: MoDate) {
		this.value = date
		this.change.dispatch(date)
	}

	private get yearSelectionTemplate() {
		return html`
			<mo-scroll height='*'>
				<mo-grid rows='repeat(50, var(--mo-calendar-day-size))' columns='repeat(4, 1fr)'>
					${this.years.map(year => html`
						<mo-flex class=${classMap({ year: true, selected: this.navigatingYear === year })} @click=${() => this.selectYear(year)}>
							${year}
						</mo-flex>
					`)}
				</mo-grid>
			</mo-scroll>
		`
	}

	private selectYear(year: number) {
		this.navigatingYear = year
		this.yearSelection = false
	}

	private async toggleYearSelection() {
		this.yearSelection = !this.yearSelection
		if (this.yearSelection) {
			await Promise.delegateToEventLoop(() => this.selectedYearElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' }))
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-calendar': Calendar
	}
}