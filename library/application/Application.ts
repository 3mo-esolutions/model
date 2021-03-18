import { css, html, property, Component, PageHost, TemplateResult, query, nothing, ApplicationProvider } from '..'
import { DialogAuthenticator } from './DialogAuthenticator'
import { DocumentHelper, PwaHelper, ThemeHelper } from '../../helpers'
import { Drawer } from '../../components'
import { styles } from './styles.css'

export abstract class Application extends Component {
	static AuthenticatorConstructor?: Constructor<DialogAuthenticator>
	static readonly providers = new Set<ApplicationProvider>()

	abstract get drawerTemplate(): TemplateResult

	constructor() {
		super()
		this.id = 'application'
		DocumentHelper.injectCSS(styles)
		DocumentHelper.disableDefaultContextMenu()
		PwaHelper.registerServiceWorker()
	}

	get authenticator() {
		return Application.AuthenticatorConstructor ? new Application.AuthenticatorConstructor() : undefined
	}

	@property({ reflect: true }) theme = ThemeHelper.Background.calculatedValue
	@property() pageTitle?: string
	@property({ type: Object }) authenticatedUser = DialogAuthenticator.AuthenticatedUser.value
	@property({ type: Boolean }) drawerDocked = Drawer.IsDocked.value
	@property({ type: Boolean }) drawerOpen = this.drawerDocked
	@property({ type: Boolean, reflect: true }) topAppBarProminent = false

	@query('slot[name="topAppBarDetails"]') readonly topAppBarDetailsSlot!: HTMLSlotElement

	protected async initialized() {
		await this.authenticate()

		const providers = Array.from(Application.providers.keys())
		await Promise.all(providers.filter(p => p.afterAuthentication === true).map(p => p.provide()))

		ThemeHelper.Background.changed.subscribe(() => this.theme = ThemeHelper.Background.calculatedValue)
		DialogAuthenticator.AuthenticatedUser.changed.subscribe(user => this.authenticatedUser = user)
		Drawer.IsDocked.changed.subscribe(isDocked => this.drawerDocked = isDocked)

		if (window.location.pathname === '/' || window.location.pathname === '') {
			PageHost.navigateToHomePage()
		} else {
			PageHost.navigateToPath(MoDeL.Router.relativePath)
		}
	}

	private authenticate = () => this.authenticator?.confirm()
	private unauthenticate = async () => {
		await this.authenticator?.unauthenticate()
		this.drawerOpen = false
	}

	private get hasDrawerProfile() {
		return !this.drawerDocked && !!this.authenticator && !!this.authenticatedUser
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

			#spanAppTitle {
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

				#spanAppTitle {
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
				<span id='spanAppTitle'>${Manifest.short_name}</span>
			</mo-flex>

			<mo-flex slot='title' alignItems='center'>
				<span id='spnPageTitle'>${this.pageTitle}</span>
				<slot name='topAppBarDetails'></slot>
			</mo-flex>

			<slot slot='actionItems' name='actionItems'>
				${this.topAppBarActionItemsTemplate}
			</slot>

			<mo-drawer
				type=${this.drawerDocked ? 'dismissible' : 'modal'}
				?open=${this.drawerOpen}
				?hasHeader=${this.hasDrawerProfile}
				@MDCDrawer:opened=${() => this.drawerOpen = true}
				@MDCDrawer:closed=${() => this.drawerOpen = false}
			>
				<mo-flex slot='title' ?hidden=${!this.hasDrawerProfile}>
					<span class='username'>${this.authenticatedUser?.name}</span>
					<span class='email'>${this.authenticatedUser?.email}</span>
				</mo-flex>

				<mo-flex height='100%'>
					<mo-drawer-list height='*' open root>
						${this.drawerTemplate}
					</mo-drawer-list>

					<mo-drawer-list open root>
						${this.drawerFooterTemplate}
						<mo-drawer-item ?hidden=${!this.authenticator || !this.authenticatedUser} icon='login' @click=${this.unauthenticate}>Logout</mo-drawer-item>
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

	protected get topAppBarActionItemsTemplate() {
		return this.drawerDocked === false || this.authenticator === undefined
			? nothing
			: html`<mo-user-avatar .user=${this.authenticatedUser}></mo-user-avatar>`
	}

	protected get drawerFooterTemplate() {
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