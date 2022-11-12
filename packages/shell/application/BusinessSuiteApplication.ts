import { css, html, property, nothing, query, style } from '@a11d/lit'
import { PwaHelper, RouteMatchMode, routerLink } from '@a11d/lit-application'
import { DialogReleaseNotes, Drawer, PagePreferences } from '../../components'
import { styles } from './styles.css'
import { Localizer } from '../../localization'
import { Application, deactivateInert } from '@a11d/lit-application'
import { Authentication } from '@a11d/lit-application-authentication'

Localizer.register(LanguageCode.German, {
	'User Settings': 'Benutzereinstellungen',
})

export abstract class BusinessSuiteApplication extends Application {
	@property({ type: Boolean }) drawerOpen = false

	@query('mo-drawer') readonly drawer!: Drawer

	constructor() {
		super()
		this.switchAttribute('application', true)
		PwaHelper.registerServiceWorker('/ServiceWorker.js')
		deactivateInert(this.constructor as any)
	}

	closeDrawerIfDismissible() {
		if (this.drawerOpen && this.drawer.type === 'modal') {
			this.drawerOpen = false
		}
	}

	override async connected() {
		await new DialogReleaseNotes().confirm()
	}

	static override get styles() {
		return css`
			${styles}

			${super.styles}

			[application] {
				font-family: var(--mo-font-family) !important;
				font-size: var(--mo-font-size-default);
				background-color: var(--mo-color-background);
				color: var(--mo-color-foreground);
				min-height: 100%;
			}

			slot[name=headingDetails] {
				--mdc-theme-primary: var(--mo-color-accessible);
				--mdc-tab-text-label-color-default: rgba(255,255,255,0.5);
			}

			[application][data-mobile-navigation] mo-flex[slot=navigationIcon] *:not(mo-icon-button[icon=menu]) {
				display: none;
			}

			lit-page-host {
				padding: var(--mo-thickness-xl);
			}
		`
	}

	protected override get template() {
		return html`
			${super.template}
			<mo-context-menu-host></mo-context-menu-host>
			<mo-confetti></mo-confetti>
		`
	}

	protected override get bodyTemplate() {
		return html`
			${this.drawerTemplate}
			${this.navbarTemplate}
			${super.bodyTemplate}
		`
	}

	protected get navbarTemplate() {
		return html`
			<mo-flex direction='horizontal' ${style({ background: 'var(--mo-color-accent)', paddingLeft: '4px' })}>
				<mo-flex direction='horizontal' alignItems='center' ${style({ color: 'var(--mo-color-accessible)' })}>
					${this.navbarLeadingTemplate}
				</mo-flex>

				<mo-flex ${style({ height: 'var(--mo-top-app-bar-height)' })} alignItems='center' justifyContent='center'>
					${this.navbarNavigationTemplate}
				</mo-flex>
			</mo-flex>
		`
	}

	protected get navbarLeadingTemplate() {
		return html`
			${this.navbarMenuTemplate}
			${this.navbarLogoTemplate}
			${this.navbarHeadingTemplate}
		`
	}

	protected get navbarMenuTemplate() {
		return html`
			<mo-icon-button icon='menu'
				${style({ fontSize: '20px' })}
				@click=${() => this.drawerOpen = !this.drawerOpen}
			></mo-icon-button>
		`
	}

	protected get navbarLogoTemplate() {
		return html`
			<mo-application-logo ${style({ height: '30px', margin: '0 0 0 var(--mo-thickness-xl)' })}></mo-application-logo>
		`
	}

	protected get navbarHeadingTemplate() {
		return html`
			<span ${style({ margin: '2px 0 0 8px', fontSize: '23px', fontFamily: 'Google Sans' })}>
				${manifest?.short_name}
			</span>
		`
	}

	protected get navbarNavigationTemplate() {
		return !Authentication.hasAuthenticator() ? nothing : html`
			<mo-user-avatar>
				${this.userAvatarMenuItemsTemplate}
			</mo-user-avatar>
		`
	}

	protected get drawerTemplate() {
		return html`
			<mo-drawer
				?open=${this.drawerOpen}
				@MDCDrawer:opened=${() => this.drawerOpen = true}
				@MDCDrawer:closed=${() => this.drawerOpen = false}
			>
				<mo-flex slot='title'>
					${this.drawerTitleTemplate}
				</mo-flex>

				<mo-flex ${style({ height: '100%' })}>
					<mo-list ${style({ height: '*' })}>
						${this.drawerContentTemplate}
					</mo-list>

					<mo-list>
						${this.drawerFooterTemplate}
					</mo-list>
				</mo-flex>
			</mo-drawer>
		`
	}

	protected get userAvatarMenuItemsTemplate() {
		return html`
			<mo-navigation-list-item icon='manage_accounts' label=${_('User Settings')}
				${routerLink({ page: new PagePreferences({}), matchMode: RouteMatchMode.IgnoreParameters })}
			></mo-navigation-list-item>
		`
	}

	protected get drawerContentTemplate() {
		return nothing
	}

	protected get drawerTitleTemplate() {
		return this.navbarHeadingTemplate
	}

	protected get drawerFooterTemplate() {
		return nothing
	}
}

declare global {
	namespace MoDeL {
		interface Globals {
			readonly application: BusinessSuiteApplication
		}
	}
}