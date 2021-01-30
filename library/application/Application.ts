import { css, html, property, Component, PageHost, TemplateResult, query, nothing, ApplicationProvider } from '..'
import { Themes } from '../../types'
import DialogAuthenticator from './DialogAuthenticator'
import { DocumentHelper, PwaHelper, StorageContainer } from '../../helpers'

export default abstract class Application extends Component {
	abstract get drawerTemplate(): TemplateResult
	static AuthenticatorConstructor?: Constructor<DialogAuthenticator>
	static readonly providers = new Set<ApplicationProvider>()

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
		this.handleThemes()
	}


	get authenticator() {
		return Application.AuthenticatorConstructor ? new Application.AuthenticatorConstructor() : undefined
	}

	@property({ reflect: true }) theme?: Exclude<Themes, Themes.System>
	@property() pageTitle?: string
	@property({ type: Object }) authenticatedUser = StorageContainer.Authentication.AuthenticatedUser.value
	@property({ type: Boolean }) drawerDocked = StorageContainer.Components.Drawer.IsDocked.value
	@property({ type: Boolean }) drawerOpen = this.drawerDocked
	@property({ type: Boolean, reflect: true }) topAppBarProminent = false

	@query('slot[name="topAppBarDetails"]') readonly topAppBarDetailsSlot!: HTMLSlotElement

	protected async initialized() {
		await this.authenticate()

		const providers = Array.from(Application.providers.keys())
		await Promise.all(providers.filter(p => p.afterAuthentication === true).map(p => p.provide()))

		if (window.location.pathname === '/' || window.location.pathname === '') {
			PageHost.navigateToHomePage()
		} else {
			PageHost.navigateToPath(MoDeL.Router.relativePath)
		}

		StorageContainer.Authentication.AuthenticatedUser.changed.subscribe(user => this.authenticatedUser = user)
		StorageContainer.Components.Drawer.IsDocked.changed.subscribe(isDocked => this.drawerDocked = isDocked)
	}

	private handleThemes() {
		const getTheme = (theme: Themes = StorageContainer.Theme.Background.value) => {
			if (theme === Themes.System) {
				const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
				return isDark ? Themes.Dark : Themes.Light
			}
			return theme
		}
		this.theme = getTheme()
		StorageContainer.Theme.Background.changed.subscribe(theme => this.theme = getTheme(theme))
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => this.theme = getTheme())
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

			#spnAppTitle {
				margin: 2px 0 0 8px;
				font-size: 23px;
				font-family: Google Sans;
			}

			#spnPageTitle {
				font-size: var(--mo-font-size-l);
			}

			:host([isTopAppBarProminent]) #spnPageTitle {
				margin-bottom: 9px;
			}

			slot[name=topAppBarDetails] {
				--mdc-theme-primary: white;
				--mdc-tab-text-label-color-default: rgba(255,255,255,0.5);
			}

			.username {
				font-size: var(--mo-font-size-xl);
				font-weight: 500;
			}

			.email {
				font-size: var(--mo-font-size-m);
				font-weight: 400;
				color: var(--mo-color-gray)
			}

			@media (max-width: 768px) {
				mo-logo {
					display: none;
				}

				#spnAppTitle {
					display: none;
				}
			}
		`
	}

	protected render = () => html`
		<mo-top-app-bar dense centerTitle ?prominent=${this.topAppBarProminent}>
			<mo-flex slot='navigationIcon' direction='horizontal' alignItems='center'>
				<mo-icon-button icon='menu' @click=${() => this.drawerOpen = !this.drawerOpen}></mo-icon-button>
				<mo-logo height='30px' margin='0 0 0 var(--mo-thickness-xl)' foreground='var(--mo-color-accessible)'></mo-logo>
				<span id='spnAppTitle'>${Manifest.short_name}</span>
			</mo-flex>

			<mo-flex slot='title' alignItems='center'>
				<span id='spnPageTitle'>${this.pageTitle}</span>
				<slot name='topAppBarDetails'></slot>
			</mo-flex>

			${this.topAppBarProfile}

			<mo-drawer
				type=${this.drawerDocked ? 'dismissible' : 'modal'}
				?open=${this.drawerOpen}
				?hasHeader=${this.hasDrawerProfile}
				@MDCDrawer:opened=${() => this.drawerOpen = true}
				@MDCDrawer:closed=${() => this.drawerOpen = false}
			>
				${this.drawerProfile}

				<mo-flex height='100%'>
					<mo-drawer-list height='*' open root>
						${this.drawerTemplate}
					</mo-drawer-list>

					<mo-drawer-list open root>
						${this.renderDrawerExtras()}
						<mo-drawer-item ?hidden=${!this.authenticator || !this.authenticatedUser} icon='login' @click=${this.unauthenticate.bind(this)}>Logout</mo-drawer-item>
					</mo-drawer-list>
				</mo-flex>

				<mo-page-host slot='appContent'></mo-page-host>
			</mo-drawer>
		</mo-top-app-bar>

		<mo-snackbar></mo-snackbar>
		<mo-dialog-host></mo-dialog-host>
		<mo-context-menu-host></mo-context-menu-host>
		<mo-confetti></mo-confetti>
	`

	private authenticate = async () => await this.authenticator?.confirm()
	private unauthenticate = async () => {
		await this.authenticator?.unauthenticate()
		this.drawerOpen = false
	}

	private get hasDrawerProfile() {
		return !this.drawerDocked && !!this.authenticator && !!this.authenticatedUser
	}

	private get drawerProfile() {
		return !this.hasDrawerProfile ? nothing : html`
			<mo-flex slot='title'>
				<span class='username'>${this.authenticatedUser?.name}</span>
				<span class='email'>${this.authenticatedUser?.email}</span>
			</mo-flex>
		`
	}

	private get topAppBarProfile() {
		if (this.drawerDocked === false || this.authenticator === undefined)
			return nothing

		if (this.authenticatedUser) {
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
		} else {
			return html`
				<mo-flex slot='actionItems' direction='horizontal' alignItems='center' justifyContent='center'>
					<mo-icon-button icon='account_circle' @click=${this.authenticate.bind(this)}></mo-icon-button>
				</mo-flex>
			`
		}
	}

	protected renderDrawerExtras() {
		return nothing
	}
}

declare global {
	namespace MoDeL {
		interface Globals {
			readonly application: Application
		}
	}
}