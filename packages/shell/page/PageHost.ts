import { Component, component, css, html } from '../../library'
import { HttpErrorCode, PwaHelper } from '../../utilities'
import { PageComponent, PageError } from '.'
import { AuthorizationHelper, Snackbar } from '..'
import { PageParameters } from './PageComponent'

export const enum NavigationMode {
	Navigate,
	NewTab,
	NewWindow
}

@component('mo-page-host')
export class PageHost extends Component {
	static get instance() { return MoDeL.application.shadowRoot!.querySelector('mo-page-host') as PageHost }

	static get navigateToHomePage() { return this.instance.navigateToHomePage }
	static get navigateToPage() { return this.instance.navigateToPage }
	static get navigateToPath() { return this.instance.navigateToPath }
	static get currentPage() { return this.instance.pageComponent }

	constructor() {
		super()
		MoDeL.Router.navigated.subscribe(() => this.navigateToPath(MoDeL.Router.relativePath))
	}

	private get pageComponent() { return this.firstChild as PageComponent<any> | null }
	private set pageComponent(value) {
		this.removeChildren()
		if (value) {
			this.append(value)
		}
	}

	private readonly navigateToPath = (relativePath: string) => {
		const pageComponent = MoDeL.Router.getPage(relativePath)
		const page = pageComponent ? new pageComponent(MoDeL.Router.getParameters(relativePath)) : new PageError({ error: HttpErrorCode.NotFound })
		page.navigate()
	}

	private readonly navigateToPage = <T extends PageComponent<any>>(page: T, mode = NavigationMode.Navigate) => {
		if (this.pageComponent?.tagName === page.tagName && JSON.stringify(this.pageComponent['parameters']) === JSON.stringify(page['parameters'])) {
			return
		}

		const relativePath = MoDeL.Router.getPath(page)
		const url = window.location.origin + relativePath

		if (PwaHelper.isInstalled && mode === NavigationMode.NewTab && Manifest.display_override?.includes('tabbed') === false) {
			mode = NavigationMode.NewWindow
		}

		switch (mode) {
			case NavigationMode.Navigate:
				this.navigate(page)
				break
			case NavigationMode.NewTab:
				const newTab = window.open(url, '_blank')
				newTab?.focus()
				break
			case NavigationMode.NewWindow:
				const windowWidth = window.outerWidth // 1360
				const windowHeight = window.outerHeight // 728
				const xPos = 0 // (screen.width / 2) - (windowWidth / 2)
				const yPos = 0 // (screen.height / 2) - (windowHeight / 2)
				const newWindow = window.open(url, undefined, `width=${windowWidth},height=${windowHeight}`)
				if (!newWindow) {
					Snackbar.show('Allow to open a window')
					return
				}
				newWindow.moveTo(xPos, yPos)
				newWindow.focus()
				break
		}
	}

	private readonly navigateToHomePage = () => {
		if (!MoDeL.Router.HomePageConstructor) {
			return
		}

		this.navigate(new MoDeL.Router.HomePageConstructor())
	}

	private navigate<T extends PageComponent<TParams>, TParams extends PageParameters>(page: T) {
		this.pageComponent =
			AuthorizationHelper.isAuthorized(...page.constructor.authorizations) ? page : new PageError({ error: HttpErrorCode.Forbidden })

		const path = MoDeL.Router.getPath(page)
		if (path) {
			MoDeL.Router.relativePath = path
		}
	}

	static override get styles() {
		return css`
			::slotted(:first-child) {
				width: calc(100% - calc(2 * var(--mo-page-padding, var(--mo-thickness-xxl))));
				max-width: var(--mo-page-max-width, 2560px);
				padding: var(--mo-page-padding, var(--mo-thickness-xxl));
			}
		`
	}

	protected override get template() {
		return html`
			<mo-scroll>
				<mo-flex alignItems='center' height='100%'>
					<slot></slot>
				</mo-flex>
			</mo-scroll>
		`
	}
}

/* TODO UPSTREAM
	PageHost being a scroller itself, causes Material's TopAppBar not to collapse on page scroll.
	If this is needed, the mo-scroll should be removed, and another solution shall be found.
	An issue is therefore filed here: https://github.com/material-components/material-components-web-components/issues/2028
*/

declare global {
	interface HTMLElementTagNameMap {
		'mo-page-host': PageHost
	}
}