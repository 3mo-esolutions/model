import { Component, component, css, html, event, property } from '../../library'
import { HttpErrorCode, PwaHelper } from '../../utilities'
import { PageComponent, PageError } from '.'
import { AuthorizationHelper, Snackbar } from '..'
import { PageParameters } from './PageComponent'

export const enum NavigationMode {
	Navigate,
	NewTab,
	NewWindow,
}

/**
 * @fires navigate {CustomEvent<PageComponent<any>}
 * @fires headingChange {CustomEvent<string>}
 */
@component('mo-page-host')
export class PageHost extends Component {
	@event() readonly navigate!: EventDispatcher<PageComponent<any>>
	@event() readonly headingChange!: EventDispatcher<string>

	@property({ type: Boolean, reflect: true }) overflowScrolling = false

	constructor() {
		super()
		MoDeL.Router.navigated.subscribe(() => this.navigateToPath(MoDeL.Router.relativePath))
	}

	get currentPage() { return this.firstChild as PageComponent<any> | null }
	private set currentPage(value) {
		this.removeChildren()
		if (value) {
			this.append(value)
		}
	}

	readonly navigateToPath = (relativePath: string) => {
		const pageComponent = MoDeL.Router.getPage(relativePath)
		const page = pageComponent ? new pageComponent(MoDeL.Router.getParameters(relativePath)) : new PageError({ error: HttpErrorCode.NotFound })
		page.navigate()
	}

	readonly navigateToPage = <T extends PageComponent<any>>(page: T, mode = NavigationMode.Navigate) => {
		if (this.currentPage?.tagName === page.tagName && JSON.stringify(this.currentPage['parameters']) === JSON.stringify(page['parameters'])) {
			return
		}

		const relativePath = MoDeL.Router.getPath(page)
		const url = window.location.origin + relativePath

		if (PwaHelper.isInstalled && mode === NavigationMode.NewTab && Manifest.display_override?.includes('tabbed') === false) {
			mode = NavigationMode.NewWindow
		}

		switch (mode) {
			case NavigationMode.Navigate:
				this.navigateTo(page)
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

	readonly navigateToHomePage = () => {
		if (!MoDeL.Router.HomePageConstructor) {
			return
		}

		this.navigateTo(new MoDeL.Router.HomePageConstructor())
	}

	private async navigateTo<T extends PageComponent<TParams>, TParams extends PageParameters>(page: T) {
		this.currentPage =
			AuthorizationHelper.isAuthorized(...page.constructor.authorizations) ? page : new PageError({ error: HttpErrorCode.Forbidden })

		const path = MoDeL.Router.getPath(page)
		if (path) {
			MoDeL.Router.relativePath = path
		}

		this.navigate.dispatch(this.currentPage)
		await this.currentPage.updateComplete
		this.headingChange.dispatch(this.currentPage['page']?.heading ?? '')
	}

	static override get styles() {
		return css`
			:host([overflowScrolling]) mo-grid {
				max-width: var(--mo-page-host-max-width, unset);
			}

			:host(:not([overflowScrolling])) {
				max-width: var(--mo-page-host-max-width, unset);
			}

			mo-grid {
				/*
					Correction padding for elements with outer box shadows and borders
					that get clipped by the scroller's relative position.
				*/
				--mo-page-host-correction-padding: 1px;
				--mo-page-host-padding: calc(var(--mo-page-host-correction-padding) + var(--mo-page-host-page-padding, 0px));
				margin: auto;
				justify-content: stretch;
				width: calc(100% - calc(var(--mo-page-host-padding)) * 2);
				height: calc(100% - calc(var(--mo-page-host-padding)) * 2);
				padding: var(--mo-page-host-padding);
			}
		`
	}

	protected override get template() {
		return this.overflowScrolling === false ? html`
			<slot></slot>
		` : html`
			<mo-scroll>
				<mo-grid>
					<slot></slot>
				</mo-grid>
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