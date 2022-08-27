import { Component, css, component, html, state, nothing, property, query, classMap, style } from '../../../library'
import { Flex } from '../..'

@component('mo-calendar')
export class Calendar extends Component {
	private static readonly startingYear = 1900

	@property({ type: Boolean, reflect: true }) includeWeekNumbers = false

	@state() protected navigatingDate = new MoDate()
	@state() private yearSelection = false

	@query('.year.selected') private readonly selectedYearElement!: Flex

	private readonly today = new MoDate().round({ smallestUnit: 'day', roundingMode: 'floor' })
	private readonly years = new Array(200).fill(undefined).map((_n, i) => Calendar.startingYear + i)

	static override get styles() {
		return css`
			:host {
				--mo-calendar-max-width: 325px;
				--mo-calendar-min-height: 230px;
				--mo-calendar-day-size: 36px;
				--mo-calendar-week-number-width: var(--mo-calendar-day-size);
			}

			.monthHeader, .week {
				color: var(--mo-color-gray);
			}

			.monthHeader {
				align-items: center;
			}

			.navigatingMonth, .navigatingYear {
				font-size: var(--mo-font-size-l);
				transition: var(--mo-duration-quick);
			}

			.navigatingYear:hover {
				color: var(--mo-color-accent);
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
				width: 100%;
				justify-content: center;
				align-items: center;
			}

			.selected {
				background: var(--mo-color-accent);
				color: var(--mo-color-accessible) !important;
			}

			.day {
				height: var(--mo-calendar-day-size);
			}

			.day:hover, .year:hover {
				background: var(--mo-color-transparent-gray-3);
			}

			.day:not(.isInMonth) {
				color: var(--mo-color-gray);
			}

			.day.today {
				color: var(--mo-color-accent);
			}
		`
	}

	protected override get template() {
		return html`
			<mo-flex alignItems='center' justifyContent='center' ${style({ width: 'var(--mo-calendar-max-width)', minHeight: 'var(--mo-calendar-min-height)' })}>
				<mo-flex direction='horizontal' justifyContent='space-between' alignItems='center' ${style({ width: '100%' })}>
					<mo-icon-button icon='keyboard_arrow_left'
						@click=${() => this.navigatingDate = this.navigatingDate.addMonth(-1)}
					></mo-icon-button>
					<mo-div>
						<a class='navigatingMonth'>${this.navigatingDate.monthName}</a>
						<a class='navigatingYear' @click=${() => this.toggleYearSelection()}>${this.navigatingDate.year}</a>
					</mo-div>
					<mo-icon-button icon='keyboard_arrow_right'
						@click=${() => this.navigatingDate = this.navigatingDate.addMonth(+1)}
					></mo-icon-button>
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
				${style({ alignItems: 'center', justifyItems: 'center' })}
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

					${MoDate.getWeekRange([year, weekNumber]).map(day => this.getDayTemplate(day))}
				`)}
			</mo-grid>
		`
	}

	protected getDayTemplate(day: MoDate) {
		return html`
			<mo-flex class=${classMap(this.getDefaultDayElementClasses(day))}>${day.day}</mo-flex>
		`
	}

	protected getDefaultDayElementClasses(day: MoDate) {
		return {
			day: true,
			today: day.equals(this.today),
			isInMonth: day.month === this.navigatingDate.month,
		}
	}

	private get yearSelectionTemplate() {
		return html`
			<mo-scroll ${style({ height: '*' })}>
				<mo-grid rows='repeat(50, var(--mo-calendar-day-size))' columns='repeat(4, 1fr)'>
					${this.years.map(year => html`
						<mo-flex class=${classMap({ year: true, selected: this.navigatingDate.year === year })} @click=${() => this.selectYear(year)}>
							${year}
						</mo-flex>
					`)}
				</mo-grid>
			</mo-scroll>
		`
	}

	private selectYear(year: number) {
		this.navigatingDate.setFullYear(year)
		this.yearSelection = false
	}

	private async toggleYearSelection() {
		this.yearSelection = !this.yearSelection
		if (this.yearSelection) {
			await Promise.delegateToEventLoop(() => this.selectedYearElement.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'center'
			}))
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-calendar': Calendar
	}
}