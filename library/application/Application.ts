import { css, html, property, Component, PageHost, TemplateResult } from '..'
import { Themes } from '../../types'
import DialogAuthenticator from './DialogAuthenitcator'
import { DocumentHelper, PwaHelper, StorageContainer } from '../../helpers'

export default abstract class Application extends Component {
	abstract get drawerContent(): TemplateResult

	constructor() {
		super()
		this.id = 'application'
		DocumentHelper.linkCSS('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap')
		DocumentHelper.linkCSS('https://fonts.googleapis.com/icon?family=Material+Icons+Sharp')
		DocumentHelper.linkCSS('/styles/theme.css')
		DocumentHelper.linkCSS('/styles/animation.css')
		DocumentHelper.disableDefaultContextMenu()
		PwaHelper.registerServiceWorker()
		PwaHelper.enablePWA()
	}

	authenticator?: DialogAuthenticator

	@property({ reflect: true }) theme: Exclude<Themes, Themes.System> = Themes.Light
	@property() abstract appTitle?: string
	@property() pageTitle?: string
	@property({ type: Object }) authenticatedUser = StorageContainer.Authentication.AuthenticatedUser.value
	@property({ type: Boolean }) drawerOpen = false
	@property({ type: Boolean }) isDrawerDocked = StorageContainer.Components.Drawer.IsDocked.value

	protected async initialized() {
		if (this.authenticator) {
			await this.authenticator.confirm()
		}

		if (window.location.pathname === '/' || window.location.pathname === '') {
			PageHost.navigateToHomePage()
		} else {
			PageHost.navigateToPath(MoDeL.Router.relativePath)
		}

		StorageContainer.Authentication.AuthenticatedUser.changed.subscribe(user => this.authenticatedUser = user)
		StorageContainer.Components.Drawer.IsDocked.changed.subscribe(isDocked => this.isDrawerDocked = isDocked)
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
			<mo-top-app-bar height='var(--mo-top-app-bar-height)' dense>
				<mo-icon-button slot='navigationIcon' icon='menu' @click=${() => this.drawerOpen = !this.drawerOpen}></mo-icon-button>

				<mo-flex slot='title' direction='horizontal' alignItems='center'>
					<mo-logo height='30px' foreground='var(--mo-color-accessible)'></mo-logo>
					<span id='spnAppBarTitle'>${this.appTitle} ${this.pageTitle ? '|' : ''} ${this.pageTitle}</span>
				</mo-flex>

				${this.profileTemplate}
			</mo-top-app-bar>

			<mo-drawer
				type=${this.isDrawerDocked ? 'dismissible' : 'modal'}
				?open=${this.drawerOpen}
				@MDCDrawer:opened=${() => this.drawerOpen = true}
				@MDCDrawer:closed=${() => this.drawerOpen = false}
			>
				${this.drawerContent}
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
			readonly application: Application
		}
	}
}