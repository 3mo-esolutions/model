import { component, html, PageComponent, homePage, route, Snackbar, SnackbarType } from '@3mo/model'

@homePage()
@route('/home')
@component('sample-page-home')
export class PageHome extends PageComponent {
	protected override get template() {
		return html`
			<mo-page heading='Home' fullHeight>
				<mo-card>
					<mo-flex height='100%' alignItems='center' justifyContent='center' gap='var(--mo-thickness-xl)'>
						<mo-heading foreground='var(--mo-accent)'>Welcome to 3MO Design Library</mo-heading>
						<mo-div>As always there is a counter in a sample project. Get used to it 😀</mo-div>
						<sample-counter
							count='1'
							@countChange=${this.handleCountChange}
						></sample-counter>
					</mo-flex>
				</mo-card>
			</mo-page>
		`
	}

	private readonly handleCountChange = async (e: CustomEvent<number>) => {
		await Snackbar.show(SnackbarType.Info, `countChange event intercepted with the value: ${e.detail}`)
	}
}