import { Component, component, css, html, event, state } from '../../library'
import { HttpErrorCode, WindowHelper, WindowOpenMode } from '../../utilities'
import { PageComponent, PageError } from '.'
import { AuthorizationHelper } from '..'
import { PageNavigationStrategy, PageParameters } from './PageComponent'
import { AuthenticationHelper } from '../helpers'

/**
 * @fires navigate {CustomEvent<PageComponent<any>}
 * @fires headingChange {CustomEvent<string>}
 */
@component('mo-page-host')
export class PageHost extends Component {
	@event() readonly navigate!: EventDispatcher<PageComponent<any>>
	@event() readonly headingChange!: EventDispatcher<string>

	@state() currentPage?: PageComponent<any>

	readonly navigateToPage = async (page: PageComponent<any>, strategy = PageNavigationStrategy.Page, force = false) => {
		if (this.currentPage && Router.arePagesEqual(this.currentPage, page) && force === false) {
			return
		}

		await AuthenticationHelper.authenticateComponent(page)

		if (AuthorizationHelper.componentAuthorized(page) === false) {
			page = new PageError({ error: HttpErrorCode.Forbidden })
		}

		const url = window.location.origin + Router.getRouteByPage(page)

		if (strategy === PageNavigationStrategy.Page) {
			this.navigateTo(page)
		} else {
			await WindowHelper.openAndFocus(url, strategy === PageNavigationStrategy.Window ? WindowOpenMode.Window : WindowOpenMode.Tab)
		}
	}

	private navigateTo<T extends PageComponent<TParams>, TParams extends PageParameters>(page: T) {
		MoDeL.application.closeDrawerIfDismissible()
		this.currentPage = page
		Router.setPathByPage(page)
		this.navigate.dispatch(page)
		page.headingChange.subscribe(heading => this.headingChange.dispatch(heading))
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