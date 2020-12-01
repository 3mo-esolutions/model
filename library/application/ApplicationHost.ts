import { css, component, html, property, Component, PageHost } from '..'
import { Themes } from '../../types'
import DialogAuthenticator from './DialogAuthenitcator'
import { DocumentHelper, PwaHelper, StorageContainer } from '../../helpers'

@component('mo-application-host')
export default class ApplicationHost extends Component {
	constructor() {
		super()
		DocumentHelper.linkCSS('https://fonts.googleapis.com/css2?family=Roboto')
		DocumentHelper.linkCSS('https://fonts.googleapis.com/icon?family=Material+Icons+Sharp')
		DocumentHelper.linkCSS('/styles/theme.css')
		DocumentHelper.linkCSS('/styles/animation.css')
		DocumentHelper.disableDefaultContextMenu()
		PwaHelper.registerServiceWorker()
		PwaHelper.enablePWA()
	}

	authenticator?: DialogAuthenticator

	@property({ reflect: true }) theme: Exclude<Themes, Themes.System> = Themes.Light
	@property() appTitle?: string
	@property() pageTitle?: string
	@property({ type: Object }) authenticatedUser = StorageContainer.Authentication.AuthenticatedUser.value

	protected async initialized() {
		if (this.authenticator) {
			try {
				await this.authenticator.quickAuthenticate()
			} catch (error) {
				await this.authenticator.confirm()
			}
		}

		if (window.location.pathname === '/' || window.location.pathname === '') {
			PageHost.navigateToHomePage()
		} else {
			PageHost.navigateToPath(MoDeL.Router.relativePath)
		}
	}

	static get styles() {
		return css`
			:host {
				display: flex;
				font-family: var(--mo-font-family);
				font-size: var(--mo-font-size-default);
				background-color: var(--mo-color-background);
				color: var(--mo-color-foreground);
				min-height: 100%;
			}

			#spnAppBarTitle {
				margin: 2px 0 0 8px;
				font-size: var(--mo-font-size-l);
			}
		`
	}

	protected render() {
		return html`
			<mo-drawer type='modal'>
				<mo-flex slot='title' alignItems='center' justifyContent='center' textAlign='center' gap='10px' foreground='var(--mo-color-foreground)' opacity='0.75'>
					<mo-logo height='50px'></mo-logo>
					<span>${this.appTitle}</span>
				</mo-flex>

				<slot name='drawerContent'></slot>

				<mo-top-app-bar slot='appContent' height='var(--mo-top-app-bar-height)'>
					<mo-icon-button slot='navigationIcon' icon='menu'></mo-icon-button>

					<mo-flex slot='title' direction='horizontal' alignItems='center'>
						<mo-logo height='30px' foreground='var(--mo-color-accessible)'></mo-logo>
						<span id='spnAppBarTitle'>${this.appTitle} ${this.pageTitle ? '|' : ''} ${this.pageTitle}</span>
					</mo-flex>

					${this.profileTemplate}
				</mo-top-app-bar>
			</mo-drawer>

			<mo-page-host></mo-page-host>
			<mo-snackbar></mo-snackbar>
			<mo-dialog-host></mo-dialog-host>
			<mo-context-menu-host></mo-context-menu-host>
			<mo-confetti></mo-confetti>
		`
	}

	private get profileTemplate() {
		if (this.authenticator === undefined)
			return

		return this.authenticatedUser
			? this.authenticatedProfileTemplate
			: this.unauthenticatedProfileTemplate
	}

	private get unauthenticatedProfileTemplate() {
		return html`
			<mo-flex slot='actionItems' direction='horizontal' alignItems='center' justifyContent='center'>
				<mo-icon-button icon='account_circle' @click=${() => this.authenticator?.confirm()}></mo-icon-button>
			</mo-flex>
		`
	}

	private get authenticatedProfileTemplate() {
		if (!this.authenticatedUser)
			return

		const splittedName = this.authenticatedUser.name.split(' ')
		const initials = `${splittedName[0].charAt(0)}${splittedName.length > 1 ? splittedName[splittedName.length - 1].charAt(0) : ''}`

		return html`
			<mo-grid slot='actionItems' rows='auto auto' columns='* 40px' width='auto' padding='0 4px 0 0' columnGap='10px' textAlign='right'>
				<mo-flex gridColumn='1' gridRow='1' fontSize='var(--mo-font-size-l)' justifyContent='flex-end'>${this.authenticatedUser.name}</mo-flex>
				<mo-flex gridColumn='1' gridRow='2' fontSize='var(--mo-font-size-m)'>${this.authenticatedUser.email}</mo-flex>
				<mo-flex gridColumn='2' gridRow='1 / span 2' height='40px' width='40px'
					alignSelf='center' justifySelf='center' justifyContent='center' alignItems='center'
					borderRadius='50%' background='rgba(0,0,0,0.3)' fontSize='var(--mo-font-size-l)'>
					${initials}
				</mo-flex>
			</mo-grid>
		`
	}
}

declare global {
	namespace MoDeL {
		interface Globals {
			readonly applicationHost: ApplicationHost
		}
	}
}

window.document.body.innerHTML = '<mo-application-host></mo-application-host>'