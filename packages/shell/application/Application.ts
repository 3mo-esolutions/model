import { css, html, property, Component, TemplateResult, nothing, query, } from '../../library'
import { DialogAuthenticator } from './DialogAuthenticator'
import { DocumentHelper, PwaHelper } from '../../utilities'
import { Drawer } from '../../components'
import { styles } from './styles.css'
import { ApplicationProvider, PageHost, ThemeHelper } from '..'

export abstract class Application extends Component {
	static AuthenticatorConstructor?: Constructor<DialogAuthenticator>
	static readonly providers = new Set<ApplicationProvider>()

	protected abstract get drawerTemplate(): TemplateResult

	@property({ observer: (value) => document.title = `${value} | ${Manifest.short_name}` }) pageHeading?: string
	@property({ reflect: true }) theme = ThemeHelper.background.calculatedValue
	@property({ type: Object }) authenticatedUser = DialogAuthenticator.authenticatedUser.value
	@property({ type: Boolean }) drawerDocked = Drawer.isDocked.value
	@property({ type: Boolean }) drawerOpen = false
	@property({ type: Boolean, reflect: true }) topAppBarProminent = false
	@property({ reflect: true }) view: 'desktop' | 'tablet' = 'desktop'

	@query('mo-page-host') readonly pageHost!: PageHost

	constructor() {
		super()
		this.id = 'application'
		window.dispatchEvent(new Event('MoDeL.instantiate'))
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

	protected override async initialized() {
		ThemeHelper.background.changed.subscribe(() => this.theme = ThemeHelper.background.calculatedValue)
		Drawer.isDocked.changed.subscribe(isDocked => this.drawerDocked = isDocked)

		DialogAuthenticator.authenticatedUser.changed.subscribe(user => this.authenticatedUser = user)
		await this.authenticate()

		const providers = Array.from(Application.providers.keys())
		await Promise.all(providers.filter(p => p.afterAuthentication === true).map(p => p.provide()))

		window.dispatchEvent(new Event('MoDeL.initialize'))
	}

	async authenticate() {
		await this.authenticator?.confirm()
	}


	async unauthenticate() {
		await this.authenticator?.unauthenticate()
	}

	static override get styles() {
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

			:host([isTopAppBarProminent]) #pageHeading {
				margin-bottom: 9px;
			}

			slot[name=pageHeadingDetails] {
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

	protected override get template() {
		return html`
			<mo-top-app-bar dense centerTitle ?prominent=${this.topAppBarProminent}>
				<mo-flex slot='navigationIcon' direction='horizontal' alignItems='center' foreground='var(--mo-color-accessible)'>
					${this.topAppBarNavigationTemplate}
				</mo-flex>

				<mo-flex slot='title' alignItems='center' foreground='var(--mo-color-accessible)'>
					${this.topAppBarHeaderTemplate}
				</mo-flex>

				<slot slot='actionItems' name='actionItems'>
					<mo-flex height='var(--mo-top-app-bar-height)' alignItems='center' justifyContent='center'>
						${this.topAppBarActionItemsTemplate}
					</mo-flex>
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
						<mo-navigation-list height='*' open root>
							${this.drawerTemplate}
						</mo-navigation-list>

						<mo-navigation-list open root>
							${this.drawerFooterTemplate}
						</mo-navigation-list>
					</mo-flex>

					<mo-flex slot='appContent' height='100%'>
						${this.pageHostTemplate}
					</mo-flex>
				</mo-drawer>
			</mo-top-app-bar>

			<mo-snackbar></mo-snackbar>
			<mo-dialog-host></mo-dialog-host>
			<mo-context-menu-host></mo-context-menu-host>
			<mo-confetti></mo-confetti>
		`
	}

	protected get topAppBarNavigationTemplate() {
		return html`
			${this.menuIconButtonTemplate}
			${this.logoTemplate}
			${this.applicationNameTemplate}
		`
	}

	protected get menuIconButtonTemplate() {
		return html`
			<mo-icon-button icon='menu' @click=${() => this.drawerOpen = !this.drawerOpen}></mo-icon-button>
		`
	}

	protected get logoTemplate() {
		return html`
			<mo-logo height='30px' margin='0 0 0 var(--mo-thickness-xl)' foreground='var(--mo-color-accessible)'></mo-logo>
		`
	}

	protected get applicationNameTemplate() {
		return html`
			<span class='applicationTitle'>${Manifest.short_name}</span>
		`
	}

	protected get topAppBarHeaderTemplate() {
		return html`
			<mo-flex id='pageHeading' direction='horizontal'>
				${this.pageHeadingTemplate}
			</mo-flex>
			${this.pageHeadingDetailsTemplate}
		`
	}

	protected get pageHeadingTemplate() {
		return html`
			<span style='font-size: var(--mo-font-size-l)'>${this.pageHeading}</span>
			<slot name='pageHeading'></slot>
		`
	}

	protected get pageHeadingDetailsTemplate() {
		return html`
			<slot name='pageHeadingDetails'></slot>
		`
	}

	protected get topAppBarActionItemsTemplate() {
		return !this.authenticator ? nothing : html`
			<mo-user-avatar .user=${this.authenticatedUser}>
				${this.userAvatarMenuItemsTemplate}
			</mo-user-avatar>
		`
	}

	protected get userAvatarMenuItemsTemplate() {
		return nothing
	}

	protected get pageHostTemplate() {
		return html`
			<mo-page-host height='100%' width='100%'
				@headingChange=${(e: CustomEvent<string>) => this.pageHeading = e.detail}
			></mo-page-host>
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