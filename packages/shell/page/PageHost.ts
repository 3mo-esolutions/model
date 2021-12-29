import { Component, component, css, html, event, state } from '../../library'
import { HttpErrorCode, PwaHelper } from '../../utilities'
import { PageComponent, PageError } from '.'
import { AuthorizationHelper, Snackbar } from '..'
import { PageParameters } from './PageComponent'
import { AuthenticationHelper } from '../helpers'

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

	@state() currentPage?: PageComponent<any>

	readonly navigateToPage = async (page: PageComponent<any>, mode = NavigationMode.Navigate, force = false) => {
		if (this.currentPage && MoDeL.Router.arePagesEqual(this.currentPage, page) && force === false) {
			return
		}

		await AuthenticationHelper.authenticateComponent(page)

		if (AuthorizationHelper.componentAuthorized(page) === false) {
			page = new PageError({ error: HttpErrorCode.Forbidden })
		}

		const url = window.location.origin + MoDeL.Router.getRouteByPage(page)

		if (PwaHelper.isInstalled && mode === NavigationMode.NewTab && Manifest.display_override?.includes('tabbed') === false) {
			mode = NavigationMode.NewWindow
		}

		switch (mode) {
			case NavigationMode.Navigate:
				await this.navigateTo(page)
				break
			case NavigationMode.NewTab:
				window.open(url, '_blank')?.focus()
				break
			case NavigationMode.NewWindow:
				const newWindow = window.open(url, undefined, `width=${window.outerWidth},height=${window.outerHeight}`)
				if (!newWindow) {
					Snackbar.show('Allow to open a window')
					return
				}
				newWindow.moveTo(0, 0)
				newWindow.focus()
				break
		}
	}

	private async navigateTo<T extends PageComponent<TParams>, TParams extends PageParameters>(page: T) {
		MoDeL.application.closeDrawerIfDismissible()
		this.currentPage = page
		MoDeL.Router.setPathByPage(page)
		this.navigate.dispatch(this.currentPage)
		await this.currentPage.updateComplete
		this.headingChange.dispatch(this.currentPage['page']?.heading ?? '')
	}

	static override get styles() {
		return css`
			mo-grid {
				max-width: var(--mo-page-host-max-width, 2560px);
				margin: auto;
				justify-content: stretch;
				height: 100%;
			}
		`
	}

	protected override get template() {
		return html`
			<mo-scroll>
				<mo-grid part='pageHolder'>
					${this.currentPage}
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