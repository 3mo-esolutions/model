import { css, html, property, nothing, style, HTMLTemplateResult, ifDefined, query, repeat } from '@a11d/lit'
import { Application, deactivateInert, PageComponent, PwaHelper, RouteMatchMode, routerLink } from '@a11d/lit-application'
import { Authentication } from '@a11d/lit-application-authentication'
import { Localizer, LanguageCode } from '@3mo/localization'
import { DialogReleaseNotes, PagePreferences, Navigation } from '../BusinessSuiteApplication'
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
			${super.styles}

			:root {
				/* Duration */
				--mo-duration-quick: 250ms;
				--mo-duration-slow: 1000ms;
				/* Thickness */
				--mo-thickness-s: 4px;
				--mo-thickness-m: 6px;
				--mo-thickness-l: 8px;
				--mo-thickness-xl: 14px;
				/* Font Sizes */
				--mo-font-size-xxs: 8px;
				--mo-font-size-xs: 10px;
				--mo-font-size-s: 12px;
				--mo-font-size-m: 14px;
				--mo-font-size-l: 18px;
				--mo-font-size-xl: 24px;
				--mo-font-size-xxl: 36px;
				/* Override Material Web Components variables */
				--mdc-icon-font: Material Icons Sharp !important;
				--mdc-theme-primary: var(--mo-color-accent) !important;
				--mdc-theme-on-primary: var(--mo-color-accessible) !important;
				--mdc-theme-secondary: var(--mo-color-accent) !important;
				--mdc-theme-on-secondary: var(--mo-color-accessible) !important;
				--mdc-theme-text-secondary-on-background: var(--mo-color-gray) !important;
				--mdc-theme-surface: var(--mo-color-surface) !important;
				--mdc-theme-text-primary-on-dark: var(--mo-color-surface) !important;
				--mdc-theme-on-surface: var(--mo-color-foreground-transparent) !important;
				--mdc-theme-text-disabled-on-light: var(--mo-color-gray-transparent) !important;
				--mdc-theme-text-hint-on-background: var(--mo-color-foreground-transparent) !important;
				--mdc-theme-text-icon-on-background: var(--mo-color-gray) !important;
				--mdc-theme-text-primary-on-background: var(--mo-color-foreground) !important;
			}

			:root[data-theme=light] {
				--mo-color-foreground-transparent: rgb(48, 48, 48) !important;
				--mo-color-error-base: 176, 0, 32;
				--mo-field-background: rgba(var(--mo-color-foreground-base), 0.09);
				--mo-alternating-background: rgba(var(--mo-color-foreground-base), 0.05);
			}

			:root[data-theme=dark] {
				--mo-color-foreground-transparent: rgb(220, 220, 220) !important;
				--mo-color-error-base: 255, 61, 96;
				--mo-field-background: rgba(var(--mo-color-background-base), 0.5);
				--mo-alternating-background: rgba(var(--mo-color-background-base), 0.2);
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
			<mo-tooltip-host></mo-tooltip-host>
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
			<mo-flex direction='horizontal' gap='32px' ${style({ background: 'var(--mo-color-accent)', paddingInlineStart: '4px', height: '48px', overflow: 'hidden' })}>
				<mo-flex direction='horizontal' alignItems='center' ${style({ color: 'var(--mo-color-accessible)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' })}>
					${this.navbarStartTemplate}
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

	protected get navbarStartTemplate() {
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
			<span ${style({ margin: '2px 0 0 8px', fontSize: '23px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' })}>
				${manifest?.short_name}
			</span>
		`
	}

	protected get navbarNavigationTemplate() {
		return html`
			${repeat(this.navigations, navigation => navigation.key, navigation => this.getNavigationItemTemplate(navigation))}
		`
	}

	protected getNavigationItemTemplate(navigation: Navigation) {
		return navigation.hidden ? nothing : html`
			<mo-navigation-item .navigation=${navigation} ${!navigation.component ? nothing : routerLink({
			component: navigation.component as PageComponent,
			matchMode: navigation.matchMode,
			invocationHandler: () => this.drawerOpen = false
		})}>${navigation.label}</mo-navigation-item>
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
			<mo-navigation-list-item icon='manage_accounts'
				${routerLink({ component: new PagePreferences, matchMode: RouteMatchMode.IgnoreParameters, invocationHandler: () => this.drawerOpen = false })}
			>${t('User Settings')}</mo-navigation-list-item>
		`
	}

	protected get drawerTemplate() {
		return html`
			<mo-drawer ?open=${this.drawerOpen} @openChange=${(e: CustomEvent<boolean>) => this.drawerOpen = e.detail}>
				<mo-flex ${style({ height: '100%' })}>
					${this.drawerTitleTemplate}

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

	private getNavigationListItemTemplate(navigation: Navigation, detailsSlot = false): HTMLTemplateResult {
		if (navigation.hidden) {
			return nothing
		}

		const iconTemplate = !navigation.icon ? nothing : html`
			<mo-icon icon=${navigation.icon} style='opacity: 0.75; font-size: 24px'></mo-icon>
		`

		if (navigation.children?.length) {
			return html`
				<mo-collapsible-list-item slot=${ifDefined(detailsSlot ? 'details' : undefined)}>
					${iconTemplate}
					${navigation.label}
					${navigation.children?.map(child => this.getNavigationListItemTemplate(child, true))}
				</mo-collapsible-list-item>
			`
		}

		return html`
			<mo-navigation-list-item
				slot=${ifDefined(detailsSlot ? 'details' : undefined)}
				${!navigation.component ? nothing : routerLink({ component: navigation.component as PageComponent, matchMode: RouteMatchMode.IgnoreParameters, invocationHandler: () => this.drawerOpen = false })}
			>
				${iconTemplate}
				${navigation.label}
			</mo-navigation-list-item>
		`
	}

	protected get drawerTitleTemplate() {
		return html`
			<mo-flex direction='horizontal' alignItems='center' style='padding: 24px'>
				${this.navbarHeadingTemplate}
			</mo-flex>
		`
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