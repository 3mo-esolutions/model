import { Component, Snackbar, component, html, property } from '..'
import { PageComponent, PageError } from '.'
import { PageParameters } from './PageComponent'
import Router from './Router'
import { PermissionHelper, PwaHelper } from '../../helpers'

export const enum NavigationMode {
	Navigate,
	NewTab,
	NewWindow
}

@component('mdc-page-host')
export default class PageHost extends Component {
	static get instance() { return MDC.applicationHost.shadowRoot.querySelector('mdc-page-host') as PageHost }

	static get navigateToHomePage() { return this.instance.navigateToHomePage.bind(this.instance) }
	static get navigateToPage() { return this.instance.navigateToPage.bind(this.instance) }
	static get navigateToPath() { return this.instance.navigateToPath.bind(this.instance) }
	static get currentPage() { return this.instance.pageComponent }

	@property({ type: Boolean, reflect: true }) isLoading = false

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
		this.isLoading = true

		this.pageComponent =
			PermissionHelper.isAuthorized(...page.constructor.permissions) ? page : new PageError({ error: '403' })

		const path = Router.getPath(page)
		if (path) {
			Router.relativePath = path
		}

		setTimeout(() => this.isLoading = false, 100)
	}

	protected render() {
		return html`
			<style>
				:host {
					--mdc-page-host-padding-top: var(--mdc-thickness-d);
				}

				mdc-circular-progress {
					visibility: hidden;
				}

				/* TODO loading + animiation
				:host([isLoading]) mdc-circular-progress {
					visibility: hidden;
				}

				mdc-scroll {
					transform: translate3d(0);
					opacity: 1;
					transition: var(--mdc-duration-quick);
				}

				:host([isLoading]) mdc-scroll {
					opacity: 0;
					transform: translate3d(0, 100px, 100px);
					transition: var(--mdc-duration-instant);
				} */

				::slotted(:first-child) {
					--mdc-page-padding: 8px;
					--mdc-page-max-width: 1920px;
					width: calc(100% - calc(2 * var(--mdc-page-padding)));
					max-width: var(--mdc-page-max-width);
					padding: 0 var(--mdc-page-padding);
				}
			</style>
			<mdc-flex alignItems='center' height='calc(100% - var(--mdc-top-app-bar-height) - var(--mdc-page-host-padding-top))' margin='var(--mdc-page-host-padding-top) 0 0 0'>
				<mdc-circular-progress indeterminate position='absolute'></mdc-circular-progress>
				<slot></slot>
			</mdc-flex>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mdc-page-host': PageHost
	}
}