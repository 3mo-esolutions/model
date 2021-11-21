import { component, html, PageComponent, homePage, route, PageHost, query, PageParameters, PageComponentConstructor } from '@3mo/model'

@homePage
@route('/home')
@component('sample-page-home')
export class PageHome extends PageComponent {
	@query('mo-page-host') readonly pageHost!: PageHost

	protected override get template() {
		return html`
			<mo-page heading='Home' fullHeight>
				<mo-flex direction='horizontal' height='100%' alignItems='center' justifyContent='center' gap='var(--mo-thickness-xl)'>
					<mo-flex width='200px'>
						<mo-list>
							<mo-list-item @click=${() => this.navigateTo(new PageOne)}>Sub Page One</mo-list-item>
							<mo-list-item @click=${() => this.navigateTo(new PageTwo)}>Sub Page Two</mo-list-item>
						</mo-list>
					</mo-flex>
					<mo-flex width='*' height='100%'>
						<mo-page-host height='100%'></mo-page-host>
					</mo-flex>
				</mo-flex>
			</mo-page>
		`
	}

	private navigateTo(page: PageComponent<any>) {
		page.navigate()
	}
}


/* TODOs:
	- Try to eliminate setDocumentTitleIfIsRootPage (Customizable heading positions for page-host)
	- Try to eliminate setPageComponentFlex
	- Routes should go through many levels of pages, handle manually or automatically?
*/

async function getHostOfPageComponent<TPageConstructor extends PageComponentConstructor<T>, T extends PageParameters = void>(PageConstructor: TPageConstructor) {
	const pageHost = await PageConstructor.getHost()
	if ((pageHost.currentPage instanceof PageConstructor) === false) {
		const page = new PageConstructor()
		await page.navigate()
		await page.updateComplete
	}
	return pageHost.currentPage as InstanceType<TPageConstructor>
}

abstract class SubPageComponent extends PageComponent {
	static override async getHost() {
		const page = await getHostOfPageComponent(PageHome)
		return page.pageHost
	}
}

@component('sample-page-one')
@route('/one')
export class PageOne extends SubPageComponent {
	protected override get template() {
		return html`
			<mo-page heading='Page One' fullHeight>
				<mo-card>
					SubPageOne
				</mo-card>
			</mo-page>
		`
	}
}

@component('sample-page-two')
@route('/two')
export class PageTwo extends SubPageComponent {
	protected override get template() {
		return html`
			<mo-page heading='Page Two' fullHeight>
				<mo-card>
					Page Two
				</mo-card>
			</mo-page>
		`
	}
}