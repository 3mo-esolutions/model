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
		this.setupViews()
		DocumentHelper.injectCSS(styles)
		DocumentHelper.disableDefaultContextMenu()
		PwaHelper.registerServiceWorker()
	}

	private setupViews() {
		const handler = (e: MediaQueryListEvent | MediaQueryList) => this.view = e.matches ? 'tablet' : 'desktop'
		const mediaQueryList = window.matchMedia('(max-width: 768px)')
		handler(mediaQueryList)
		mediaQueryList.addEventListener('change', handler)
	}

	get authenticator() {
		return Application.AuthenticatorConstructor ? new Application.AuthenticatorConstructor() : undefined
	}

	@property() pageTitle?: string
	@property({ reflect: true }) theme = ThemeHelper.background.calculatedValue
	@property({ type: Object }) authenticatedUser = DialogAuthenticator.authenticatedUser.value
	@property({ type: Boolean }) drawerDocked = Drawer.isDocked.value
	@property({ type: Boolean }) drawerOpen = false
	@property({ type: Boolean, reflect: true }) topAppBarProminent = false
	@property({ reflect: true }) view: 'desktop' | 'tablet' = 'desktop'

	@query('slot[name="topAppBarDetails"]') readonly topAppBarDetailsSlot!: HTMLSlotElement

	protected async initialized() {
		await this.authenticate()

		const providers = Array.from(Application.providers.keys())
		await Promise.all(providers.filter(p => p.afterAuthentication === true).map(p => p.provide()))

		ThemeHelper.background.changed.subscribe(() => this.theme = ThemeHelper.background.calculatedValue)
		DialogAuthenticator.authenticatedUser.changed.subscribe(user => this.authenticatedUser = user)
		Drawer.isDocked.changed.subscribe(isDocked => this.drawerDocked = isDocked)

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

			.applicationTitle {
				margin: 2px 0 0 8px;
				font-size: 23px;
				font-family: Google Sans;
			}

			.pageTitle {
				font-size: var(--mo-font-size-l);
			}

			:host([isTopAppBarProminent]) .pageTitle {
				margin-bottom: 9px;
			}

			slot[name=topAppBarDetails] {
				--mdc-theme-primary: var(--mo-color-accessible);
				--mdc-tab-text-label-color-default: rgba(255,255,255,0.5);
			}

			:host([view=tablet]) mo-logo {
				display: none;
			}

			:host([view=tablet]) mo-flex[slot=navigationIcon] *:not(mo-icon-button[icon=menu]) {
				display: none;
			}
		`
	}

	protected render() {
		return html`
			<mo-top-app-bar dense centerTitle ?prominent=${this.topAppBarProminent}>
				<mo-flex slot='navigationIcon' direction='horizontal' alignItems='center' foreground='var(--mo-color-accessible)'>
					<mo-icon-button icon='menu' @click=${() => this.drawerOpen = !this.drawerOpen}></mo-icon-button>
					<mo-logo height='30px' margin='0 0 0 var(--mo-thickness-xl)' foreground='var(--mo-color-accessible)'></mo-logo>
					${this.applicationNameTemplate}
				</mo-flex>

				<mo-flex slot='title' alignItems='center' foreground='var(--mo-color-accessible)'>
					<span class='pageTitle'>${this.pageTitle}</span>
					<slot name='topAppBarDetails'></slot>
				</mo-flex>

				<slot slot='actionItems' name='actionItems'>
					${this.topAppBarActionItemsTemplate}
				</slot>

				<mo-drawer
					type=${this.drawerDocked && this.view === 'desktop' ? 'dismissible' : 'modal'}
					?open=${this.drawerOpen}
					@MDCDrawer:opened=${() => this.drawerOpen = true}
					@MDCDrawer:closed=${() => this.drawerOpen = false}
				>
					<mo-flex slot='title'>
						${this.drawerTitleTemplate}
					</mo-flex>

					<mo-flex height='100%'>
						<mo-drawer-list height='*' open root>
							${this.drawerTemplate}
						</mo-drawer-list>

						<mo-drawer-list open root>
							${this.drawerFooterTemplate}
							<mo-drawer-item icon='logout' ?hidden=${!this.authenticator || !this.authenticatedUser} @click=${this.unauthenticate}>Logout</mo-drawer-item>
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
	}

	protected get applicationNameTemplate() {
		return html`
			<span class='applicationTitle'>${Manifest.short_name}</span>
		`
	}

	protected get topAppBarActionItemsTemplate() {
		return !this.authenticator ? nothing : html`
			<mo-user-avatar .user=${this.authenticatedUser}></mo-user-avatar>
		`
	}

	protected get drawerTitleTemplate() {
		return this.applicationNameTemplate
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