import { component, html, PageComponent, homePage, route, Snackbar } from '@3mo/model'

@homePage
@route('/home')
@component('sample-page-home')
export class PageHome extends PageComponent {
	protected override get template() {
		return html`
			<mo-page header='Home' fullHeight>
				<mo-card height='100%' width='100%'>
					<mo-flex height='100%' alignItems='center' justifyContent='center' gap='var(--mo-thickness-xl)'>
						<mo-headline foreground='var(--mo-accent)'>Welcome to 3MO Design Library</mo-headline>
						<mo-div>As always there is a counter in a sample project. Get used to it 😀</mo-div>
						<sample-counter
							count='1'
							@countChange=${(e: CustomEvent<number>) => Snackbar.show(`countChange event intercepted with the value: ${e.detail}`)}
						></sample-counter>
					</mo-flex>
				</mo-card>
			</mo-page>
		`
	}
}