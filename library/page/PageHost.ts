import { Component, Snackbar, component, html } from '..'
import { PageComponent, PageError } from '.'
import { PageParameters } from './PageComponent'
import { PermissionHelper, PwaHelper } from '../../helpers'
import Router from './Router'

export const enum NavigationMode {
	Navigate,
	NewTab,
	NewWindow
}

@component('mo-page-host')
export default class PageHost extends Component {
	static get instance() { return MoDeL.applicationHost.shadowRoot.querySelector('mo-page-host') as PageHost }

	static get navigateToHomePage() { return this.instance.navigateToHomePage.bind(this.instance) }
	static get navigateToPage() { return this.instance.navigateToPage.bind(this.instance) }
	static get navigateToPath() { return this.instance.navigateToPath.bind(this.instance) }
	static get currentPage() { return this.instance.pageComponent }

	private get pageComponent() { return this.firstChild as PageComponent<any> }
	private set pageComponent(value) {
		this.removeChildren()
		if (value) {
			this.append(value)
		}
	}

	private navigateToPage<T extends PageComponent<any>>(page: T, mode = NavigationMode.Navigate) {
		const relativePath = Router.getPath(page)
		const url = window.location.origin + relativePath

		if (PwaHelper.isInstalled && mode === NavigationMode.NewTab) {
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

	private navigateToPath(relativePath: string, mode = NavigationMode.Navigate) {
		const pageComponent = Router.getPage(relativePath)
		const page = pageComponent ? new pageComponent(Router.getParameters(relativePath)) : new PageError({ error: '404' })
		this.navigateToPage(page, mode)
	}

	private navigateToHomePage() {
		if (!Router.HomePageConstructor)
			return

		this.navigate(new Router.HomePageConstructor())
	}

	private navigate<T extends PageComponent<TParams>, TParams extends PageParameters>(page: T) {
		this.pageComponent =
			PermissionHelper.isAuthorized(...page.constructor.permissions) ? page : new PageError({ error: '403' })

		const path = Router.getPath(page)
		if (path) {
			Router.relativePath = path
		}
	}

	protected render = () => html`
		<style>
			:host {
				padding-top: var(--mo-top-app-bar-height);
				flex: 1;
			}

			::slotted(:first-child) {
				--mo-page-padding: 8px;
				--mo-page-max-width: 1920px;
				width: calc(100% - calc(2 * var(--mo-page-padding)));
				max-width: var(--mo-page-max-width);
				padding: var(--mo-page-padding);
			}
		</style>
		<mo-flex alignItems='center' height='100%'>
			<slot></slot>
		</mo-flex>
	`
}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-page-host': PageHost
	}
}