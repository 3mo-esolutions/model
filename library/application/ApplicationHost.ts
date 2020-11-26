import { css, CSSResult, component, html, property, Component, PageHost } from '..'
import { Themes, User } from '../../types'
import DialogAuthenticator from './DialogAuthenitcator'
import { StorageContainer } from '../../helpers'

@component('mdc-application-host')
export default class ApplicationHost extends Component {
	constructor() {
		super()
		this.fixDocumentStyles()
		this.disableDefaultContextMenu()
		this.linkCSS('https://fonts.googleapis.com/icon?family=Material+Icons+Sharp')
	}

	authenticator?: DialogAuthenticator

	@property({ reflect: true }) theme: Exclude<Themes, Themes.System> = Themes.Light
	@property() appTitle?: string
	@property() pageTitle?: string
	@property({ type: Object }) authenticatedUser?: User = StorageContainer.Authentication.User.value

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
			PageHost.navigateToPath(MDC.Router.relativePath)
		}
	}

	static get styles() {
		return css`
			:host {
				--mdc-top-app-bar-height: 64px;
				display: block;
				font-family: var(--mdc-font-family);
				font-size: var(--mdc-font-size-default);
				background-color: var(--mdc-color-background);
				color: var(--mdc-color-foreground);
				min-height: 100%;
			}

			:host {
				--mdc-font-family: Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
				--mdc-border-radius: 4px;
				/* Lengths */
				--mdc-length-1: 480px;
				--mdc-length-2: 768px;
				--mdc-length-3: 1024px;
				--mdc-length-4: 1600px;
				--mdc-length-5: 1920px;
				--mdc-length-6: 2560px;
				--mdc-max-width: var(--mdc-length-6);
				--mdc-min-width: var(--mdc-length-3);
				--mdc-min-height: var(--mdc-length-2);
				--mdc-settings-width: var(--mdc-length-1);
				--mdc-popup-compact-width: var(--mdc-length-1);
				--mdc-popup-width: var(--mdc-length-3);
				--mdc-popup-large-width: var(--mdc-length-5);
				--mdc-popup-min-height: var(--mdc-length-1);
				--mdc-sidebar-width: 275px;
				--mdc-elm-height-d: 48px;
				--mdc-elm-height-field: calc(var(--mdc-elm-height-d) - 2px);
				--mdc-elm-height-s: 36px;
				--mdc-elm-height-xs: 32px;
				--mdc-elm-height-xxs: 24px;
				--mdc-elm-height-xxxs: 20px;
				/* Duration */
				--mdc-duration-instant: 0ms;
				--mdc-duration-super-quick: 100ms;
				--mdc-duration-quick: 250ms;
				--mdc-duration-medium: 500ms;
				--mdc-duration-slow: 1000ms;
				--mdc-duration-super-slow: 1500ms;
				/* Shadows */
				--mdc-focus-brightness: brightness(125%);
				--mdc-shadow: rgba(var(--mdc-shadow-base), .4) 0 1px 2px 0, rgba(var(--mdc-shadow-base), .2) 0 1px 3px 1px !important;
				--mdc-shadow-hover: rgba(var(--mdc-shadow-base), .4) 0 5px 40px 0, rgba(var(--mdc-shadow-base), .2) 0 5px 40px 1px !important;
				--mdc-shadow-deep: 0px 5px 5px -3px rgba(var(--mdc-shadow-base), 0.2), 0px 8px 10px 1px rgba(var(--mdc-shadow-base), 0.14), 0px 3px 14px 2px rgba(var(--mdc-shadow-base), 0.12);
				--mdc-shadow-deep-hover: 0px 5px 5px -3px rgba(var(--mdc-shadow-base), 0.2), 0px 8px 10px 1px rgba(var(--mdc-shadow-base), 0.14), 0px 3px 14px 2px rgba(var(--mdc-shadow-base), 0.12);
				/* Font Sizes */
				--mdc-font-size-1: 10px;
				--mdc-font-size-2: 12px;
				--mdc-font-size-3: 14px;
				--mdc-font-size-4: 18px;
				--mdc-font-size-5: 24px;
				--mdc-font-size-6: 36px;
				--mdc-font-size-7: 48px;
				--mdc-font-size-8: 56px;
				--mdc-font-size-icon: 20px;
				--mdc-font-size-default: var(--mdc-font-size-3);
				/* Spaces */
				--mdc-thickness-xs: 2px;
				--mdc-thickness-s: 4px;
				--mdc-thickness-d: 6px;
				--mdc-thickness-l: 8px;
				--mdc-thickness-xl: 14px;
				--mdc-thickness-xxl: 20px;
				/* Selection Colors */
				--mdc-hover-foreground: inherit;
				--mdc-selected-background: var(--mdc-accent-gradient-transparent);
				--mdc-selected-foreground: var(--mdc-accent);
				/* zIndex */
				--mdc-z-snackbar: 10;
				--mdc-z-sidebar: 4;
				--mdc-z-overlay: 3;
				--mdc-z-menu: 2;
				--mdc-z-surface: 1;
				/* Themes */
				--mdc-color-gray-base: 165, 165, 165;
				--mdc-color-gray: rgb(var(--mdc-color-gray-base)) !important;
				--mdc-color-gray-transparent: rgba(var(--mdc-color-gray-base), 0.5) !important;
				--mdc-scrim: rgba(0, 0, 0, 0.5);
				--mdc-accent: rgb(var(--mdc-accent-base));
				--mdc-accent-transparent: rgba(var(--mdc-accent-base), 0.25);
				--mdc-accent-gradient: linear-gradient(135deg, var(--mdc-accent-g));
				--mdc-accent-gradient-transparent: linear-gradient(135deg, var(--mdc-accent-gt));
				/* Override Material Web Components variables */
				--mdc-theme-primary: var(--mdc-accent) !important;
				--mdc-theme-secondary: var(--mdc-accent) !important;
				--mdc-icon-font: Material Icons Sharp !important;
				--mdc-theme-text-primary-on-dark: var(--mdc-surface) !important;
				--mdc-switch-unchecked-color: var(--mdc-color-foreground) !important;
				--mdc-radio-unchecked-color: var(--mdc-color-foreground) !important;
				--mdc-checkbox-unchecked-color: var(--mdc-color-foreground-transparent) !important;
				--mdc-linear-progress-buffer-color: var(--mdc-color-gray) !important;
				--mdc-theme-on-surface: var(--mdc-color-foreground) !important;
				--mdc-theme-surface: var(--mdc-surface) !important;
				--mdc-select-fill-color: var(--mdc-field-background) !important;
				--mdc-select-ink-color: var(--mdc-color-foreground) !important;
				--mdc-select-label-ink-color: var(--mdc-color-gray) !important;
				--mdc-select-idle-line-color: var(--mdc-color-gray) !important;
				--mdc-select-hover-line-color: var(--mdc-color-gray) !important;
				--mdc-select-dropdown-icon-color: var(--mdc-color-gray) !important;
				--mdc-text-field-fill-color: var(--mdc-field-background) !important;
				--mdc-text-field-ink-color: var(--mdc-color-foreground) !important;
				--mdc-text-field-label-ink-color: var(--mdc-color-gray) !important;
				--mdc-text-field-idle-line-color: var(--mdc-color-gray) !important;
				--mdc-text-field-hover-line-color: var(--mdc-color-gray) !important;
				--mdc-theme-text-primary-on-background: var(--mdc-color-foreground) !important;
				--mdc-icon-button-size: calc(var(--mdc-icon-size) * 2) !important;
				--mdc-dialog-heading-ink-color: var(--mdc-color-foreground) !important;
				--mdc-dialog-content-ink-color: var(--mdc-color-foreground-transparent) !important;
				--mdc-theme-on-surface: var(--mdc-color-foreground-transparent) !important;
				--mdc-theme-text-hint-on-background: var(--mdc-color-foreground-transparent) !important;
				--mdc-theme-text-icon-on-background: var(--mdc-color-gray) !important;
				--mdc-tab-color-default: var(--mdc-color-foreground-transparent) !important;
				--mdc-tab-text-label-color-default: var(--mdc-color-foreground-transparent) !important;
				--mdc-theme-text-disabled-on-light: var(--mdc-color-gray-transparent) !important;
				--mdc-button-disabled-ink-color: var(--mdc-color-gray-transparent) !important;
				--mdc-list-item-graphic-margin: 12px !important;
				--mdc-checkbox-disabled-color: var(--mdc-color-gray-transparent) !important;
				--mdc-dialog-scrim-color: var(--mdc-scrim) !important;
			}

			:host([theme='dark']) {
				--mdc-color-background-base: 0, 0, 0;
				--mdc-color-foreground-base: 255, 255, 255;
				--mdc-color-background: rgb(16, 17, 20) !important;
				--mdc-surface: rgb(42, 43, 47) !important;
				--mdc-color-foreground: white !important;
				--mdc-color-foreground-transparent: rgb(220, 220, 220) !important;
				--mdc-shadow-base: 0, 1, 3;
				--mdc-color-error: rgb(255, 61, 96);
				--mdc-hover-background: rgba(255, 255, 255, .05);
				--mdc-field-background: rgba(var(--mdc-color-background-base), 0.5);
				--mdc-field-menu-background: var(--mdc-color-background);
				--mdc-field-menu-filter: unset;
				--mdc-alternating-background: rgba(var(--mdc-color-background-base), 0.2);
			}

			:host([theme='light']) {
				--mdc-color-background-base: 255, 255, 255;
				--mdc-color-foreground-base: 0, 0, 0;
				--mdc-color-background: rgb(220, 221, 225) !important;
				--mdc-color-foreground: black !important;
				--mdc-color-foreground-transparent: rgb(48, 48, 48) !important;
				--mdc-surface: rgb(255, 255, 255) !important;
				--mdc-shadow-base: 95, 81, 78;
				--mdc-color-error: rgb(176, 0, 32);
				--mdc-hover-background: rgba(0, 0, 0, .05);
				--mdc-field-background: rgba(var(--mdc-color-foreground-base), 0.09);
				--mdc-field-menu-background: var(--mdc-surface);
				--mdc-field-menu-filter: brightness(0.91);
				--mdc-alternating-background: rgba(var(--mdc-color-foreground-base), 0.05);
			}
		`
	}

	protected render() {
		return html`
			<mdc-drawer type='modal' height='64px'>
				<mdc-flex slot='title' alignItems='center' justifyContent='center' textAlign='center' gap='10px' foreground='var(--mdc-color-foreground)'>
					<mdc-logo height='75px'></mdc-logo>
					<span>${this.appTitle}</span>
				</mdc-flex>

				<slot name='drawerContent'></slot>

				<mdc-top-app-bar slot='appContent' height='var(--mdc-top-app-bar-height)'>
					<mdc-icon-button slot='navigationIcon' icon='menu'></mdc-icon-button>

					<mdc-flex slot='title' direction='horizontal' alignItems='center' gap='8px'>
						<mdc-logo height='40px'></mdc-logo>
						<span>${this.appTitle} | ${this.pageTitle}</span>
					</mdc-flex>

					${this.profileTemplate}
				</mdc-top-app-bar>
			</mdc-drawer>

			<mdc-page-host></mdc-page-host>
			<mdc-snackbar></mdc-snackbar>
			<mdc-dialog-host></mdc-dialog-host>
			<mdc-context-menu-host></mdc-context-menu-host>
			<mdc-confetti></mdc-confetti>
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
			<mdc-flex slot='actionItems' direction='horizontal' alignItems='center' justifyContent='center'>
				<mdc-icon-button icon='account_circle'></mdc-icon-button>
			</mdc-flex>
		`
	}

	private get authenticatedProfileTemplate() {
		if (!this.authenticatedUser)
			return

		const splittedName = this.authenticatedUser.name.split(' ')
		const initials = `${splittedName[0].charAt(0)}${splittedName.length > 1 ? splittedName[splittedName.length - 1].charAt(0) : ''}`

		return html`
			<mdc-grid slot='actionItems' rows='auto auto' columns='* 40px' width='auto' padding='0 4px 0 0' columnGap='10px' textAlign='right'>
				<mdc-flex gridColumn='1' gridRow='1' fontSize='var(--mdc-font-size-4)'>${this.authenticatedUser.name}</mdc-flex>
				<mdc-flex gridColumn='1' gridRow='2' fontSize='var(--mdc-font-size-3)'>${this.authenticatedUser.email}</mdc-flex>
				<mdc-flex gridColumn='2' gridRow='1 / span 2' height='var(--mdc-elm-height-d)' width='var(--mdc-elm-height-d)'
					alignSelf='center' justifySelf='center' justifyContent='center' alignItems='center'
					borderRadius='50%' background='rgba(0,0,0,0.3)' fontSize='var(--mdc-font-size-4)'>
					${initials}
				</mdc-flex>
			</mdc-grid>
		`
	}

	private linkCSS(uri: string): void {
		const link = document.createElement('link')
		link.rel = 'stylesheet'
		link.type = 'text/css'
		link.href = uri
		document.head.append(link)
	}

	private injectCSS(styles: CSSResult) {
		const style = document.createElement('style')
		style.innerHTML = styles.cssText
		document.head.append(style)
	}

	private disableDefaultContextMenu() {
		document.body.oncontextmenu = () => false
	}

	fixDocumentStyles() {
		this.injectCSS(css`
			:root {
				--mdc-scrollbar-background-color: transperent;
				--mdc-scrollbar-foreground-color: rgba(128, 128, 128, 0.75);
			}

			html {
				height: 100%;
				height: 100%;
				scrollbar-width: thin;
				scrollbar-color: var(--mdc-scrollbar-foreground-color) var(--mdc-scrollbar-background-color);
			}

			body {
				height: 100%;
				width: 100%;
				margin: 0;
				padding: 0;
				overflow: auto;
			}

			::-webkit-scrollbar {
				width: 5px;
				height: 5px;
				background-color: var(--mdc-scrollbar-background-color);
			}

			::-webkit-scrollbar-thumb {
				background: var(--mdc-scrollbar-foreground-color);
			}
		`)
	}
}

declare global {
	namespace MDC {
		interface Globals {
			readonly applicationHost: ApplicationHost
		}
	}
}

window.document.body.innerHTML = '<mdc-application-host></mdc-application-host>'