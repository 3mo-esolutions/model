import { PageComponent, component, html, homePage, route } from '@3mo/model/library'

@homePage
@route('/home')
@component('sample-page-home')
export class PageHome extends PageComponent {
	render = () => html`
		<mo-page header='Startseite' fullHeight>
			<style>
				h1 {
					color: var(--mo-accent);
					font-weight: 500;
				}
			</style>
			<mo-card height='100%' width='100%'>
				<mo-flex alignItems='center' justifyContent='center' height='*'>
					<h1>Welcome to 3MO Design Library</h1>
				</mo-flex>
			</mo-card>
		</mo-page>
	`
}