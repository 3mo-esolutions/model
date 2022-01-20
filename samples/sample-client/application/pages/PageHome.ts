import { component, html, PageComponent, homePage, route, Snackbar, property } from '@3mo/model'
import { DialogTest } from 'application/dialogs'

@homePage()
@route('/home')
@component('sample-page-home')
export class PageHome extends PageComponent {
	@property() name = 'Home'

	protected override get template() {
		return html`
			<mo-page heading='Home' fullHeight>
				<mo-card>
					<mo-flex height='100%' alignItems='center' justifyContent='center' gap='var(--mo-thickness-xl)'>
						<mo-heading foreground='var(--mo-accent)'>Welcome to 3MO Design Library</mo-heading>
						<mo-div>As always there is a counter in a sample project. Get used to it 😀</mo-div>
						<sample-counter
							count='1'
							@countChange=${(e: CustomEvent<number>) => Snackbar.show(`countChange event intercepted with the value: ${e.detail}`)}
						></sample-counter>

						<mo-button @click=${async () => this.name = await new DialogTest().confirm()}>${this.name}</mo-button>

						<mo-field-date></mo-field-date>
						<mo-field-text counter='50'></mo-field-text>
					</mo-flex>
				</mo-card>
			</mo-page>
		`
	}
}