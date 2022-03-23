import { component, html, PageComponent, homePage, route, LocalizationHelper, state } from '@3mo/model'

LocalizationHelper.language.value = 'de'

@homePage()
@route('/home')
@component('sample-page-home')
export class PageHome extends PageComponent {
	@state() date?: Date
	protected override get template() {
		return html`
			<mo-page heading='Home' fullHeight>
				<mo-card>
					<mo-flex height='100%' alignItems='center' justifyContent='center' gap='var(--mo-thickness-xl)'>
						<mo-field-date label='Date'
							.value=${this.date}
							@change=${(e: CustomEvent<Date>) => this.date = e.detail}
						></mo-field-date>

						<mo-field-date-range label='Date Range'
							.shortcutReferenceDate=${new MoDate(this.date ?? new Date)}
							@change=${({ detail: [startDate, endDate] }: CustomEvent<DateRange>) => console.log(startDate, endDate)}
						></mo-field-date-range>
					</mo-flex>
				</mo-card>
			</mo-page>
		`
	}
}