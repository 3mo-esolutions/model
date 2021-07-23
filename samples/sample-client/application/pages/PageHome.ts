import { PageComponent, component, html, homePage, route, Snackbar } from '@3mo/model/library'

@homePage
@route('/home')
@component('sample-page-home')
export class PageHome extends PageComponent {
	protected override get template() {
		return html`
			<mo-page header='Home' fullHeight>
				<style>
					h1 {
						color: var(--mo-accent);
						font-weight: 500;
					}
				</style>
				<mo-card height='100%' width='100%'>
					<mo-flex alignItems='center' justifyContent='center' height='*' gap='var(--mo-thickness-xl)'>
						<h1>Welcome to 3MO Design Library</h1>
						<span>As always there is a counter in a sample project. Get used to it 😀</span>
						<sample-counter-button
							count='0'
							@countChange=${(e: CustomEvent<number>) => Snackbar.show(`countChange event intercepted with the value: ${e.detail}`)}
						></sample-counter-button>
					</mo-flex>
				</mo-card>
			</mo-page>
		`
	}
}