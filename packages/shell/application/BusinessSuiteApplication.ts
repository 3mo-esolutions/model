import { css, html, property, nothing, style, HTMLTemplateResult, ifDefined, query } from '@a11d/lit'
import { Application, deactivateInert, PageComponent, PwaHelper, RouteMatchMode, routerLink } from '@a11d/lit-application'
import { Authentication } from '@a11d/lit-application-authentication'
import { DialogReleaseNotes, PagePreferences } from '../../components'
import { styles } from './styles.css'
import { Localizer } from '../../localization'
import { Navigation } from '../navigation'
import { observeResize } from '@3mo/resize-observer'
import { observeMutation } from '@3mo/mutation-observer'

Localizer.register(LanguageCode.German, {
	'User Settings': 'Benutzereinstellungen',
})

export abstract class BusinessSuiteApplication extends Application {
	@property({ type: Boolean }) drawerOpen = false
	@property({ type: Boolean, reflect: true }) mobileNavigation = false

	protected abstract get navigations(): Array<Navigation>

	constructor() {
		super()
		PwaHelper.registerServiceWorker('/ServiceWorker.js')
		deactivateInert(this.constructor as any)
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

			[application][mobileNavigation] #navbarNavigations {
				visibility: hidden;
			}

			[application]:not([mobileNavigation]) mo-icon-button[icon=menu] {
				display: none;
			}
		`
	}

	@query('#navbarNavigations') protected readonly navigationsContainer!: HTMLElement

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
			<mo-flex direction='horizontal' gap='32px' ${style({ background: 'var(--mo-color-accent)', paddingLeft: '4px', height: '48px' })}>
				<mo-flex direction='horizontal' alignItems='center' ${style({ color: 'var(--mo-color-accessible)' })}>
					${this.navbarLeadingTemplate}
				</mo-flex>

				<mo-flex id='navbarNavigations' direction='horizontal' alignItems='center' gap='8px'
					${style({ flex: '1', overflow: 'hidden' })}
					${observeResize(() => this.checkNavigationOverflow())}
					${observeMutation(() => this.checkNavigationOverflow())}
				>
					${this.navbarNavigationTemplate}
				</mo-flex>

				<mo-flex direction='horizontal' alignItems='center' gap='8px'>
					${this.navbarTrailingTemplate}
				</mo-flex>
			</mo-flex>
		`
	}

	private checkNavigationOverflow() {
		const lastNavigationItem = this.navigationsContainer.style.flexDirection === 'row-reverse'
			? this.navigationsContainer.firstElementChild
			: this.navigationsContainer.lastElementChild

		const firstNavigationItem = this.navigationsContainer.style.flexDirection === 'row-reverse'
			? this.navigationsContainer.lastElementChild
			: this.navigationsContainer.firstElementChild

		const scrollWidth = (lastNavigationItem?.getBoundingClientRect().right ?? 0) - (firstNavigationItem?.getBoundingClientRect().left ?? 0)
		this.mobileNavigation = this.navigationsContainer.clientWidth < scrollWidth
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
		return html`
			${this.navigations.map(navigation => this.getNavigationItemTemplate(navigation))}
		`
	}

	protected getNavigationItemTemplate(navigation: Navigation) {
		return html`
			<mo-navigation-item ${!navigation.component ? nothing : routerLink({ component: navigation.component as PageComponent, matchMode: navigation.matchMode })} .navigation=${navigation}>${navigation.label}</mo-navigation-item>
		`
	}

	protected get navbarTrailingTemplate() {
		return html`
			${this.userAvatarTemplate}
		`
	}

	protected get userAvatarTemplate() {
		return !Authentication.hasAuthenticator() ? nothing : html`
			<mo-user-avatar>
				${this.userAvatarMenuItemsTemplate}
			</mo-user-avatar>
		`
	}

	protected get userAvatarMenuItemsTemplate() {
		return html`
			<mo-navigation-list-item icon='manage_accounts' label=${_('User Settings')}
				${routerLink({ component: new PagePreferences, matchMode: RouteMatchMode.IgnoreParameters })}
			></mo-navigation-list-item>
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

	protected get drawerContentTemplate() {
		return html`${this.navigations.map(navigation => this.getNavigationListItemTemplate(navigation))}`
	}

	private getNavigationListItemTemplate(navigation: Navigation): HTMLTemplateResult {
		return html`
			<mo-navigation-list-item
				icon=${ifDefined(navigation.icon)}
				${!navigation.component ? nothing : routerLink({ component: navigation.component as PageComponent, matchMode: RouteMatchMode.IgnoreParameters })}
			>
				${navigation.label}
				${navigation.children?.map(child => this.getNavigationListItemTemplate(child))}
			</mo-navigation-list-item>
		`
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