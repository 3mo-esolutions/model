import { state, html, component, Component, css, nothing, style } from '@a11d/lit'
import { Authentication } from '@a11d/lit-application-authentication'
import { BusinessSuiteDialogAuthenticator, User } from './DialogAuthenticator'

@component('mo-user-avatar')
export class UserAvatar extends Component {
	@state() private menuOpen = false

	static override get styles() {
		return css`
			:host {
				padding: 3px 0;
				display: flex;
			}

			mo-avatar {
				place-self: center;
				color: var(--mo-color-foreground);
				background: rgba(0, 0, 0, 0.25);
			}

			mo-avatar:hover {
				cursor: pointer;
				background: rgba(0, 0, 0, calc(0.25 * 2));
			}
		`
	}

	protected override initialized() {
		BusinessSuiteDialogAuthenticator.authenticatedUserStorage.changed.subscribe(() => this.requestUpdate())
	}

	private get user() {
		return BusinessSuiteDialogAuthenticator.authenticatedUserStorage.value as User | undefined
	}

	private get name() {
		return this.user?.name?.split(' ').map(string => string.charAt(0).toUpperCase() + string.slice(1)).join(' ')
	}

	private get initials() {
		return this.name
			?.split(' ')
			.map((s, i, array) => i === array.length - 1 || i === 0 ? s.charAt(0) : '')
			.join('')
	}

	protected override get template() {
		return html`
			<mo-avatar ${style({ color: 'var(--mo-color-accessible)' })} @click=${() => this.menuOpen = !this.menuOpen}>
				${this.avatarContentTemplate}
			</mo-avatar>

			<mo-menu .anchor=${this} corner='BOTTOM_START' activatable
				?open=${this.menuOpen}
				@opened=${() => this.menuOpen = true}
				@closed=${() => this.menuOpen = false}
			>
				${this.avatarTemplate}

				<slot></slot>

				<li divider padded role='separator'></li>

				${!Authentication.hasAuthenticator() || !this.user ? nothing : html`
					<mo-list-item icon='exit_to_app' disabled style='cursor: pointer; pointer-events: auto;' @click=${() => Authentication.unauthenticate()}>
						Sign out
					</mo-list-item>
				`}
			</mo-menu>
		`
	}

	private get avatarTemplate() {
		return !BusinessSuiteDialogAuthenticator.authenticatedUserStorage.value ? nothing : html`
			<mo-list-item graphic='avatar' twoLine nonInteractive>
				<span>${this.name}</span>
				<span slot='secondary'>${this.user?.email}</span>
				<mo-avatar slot='graphic'>
					${this.avatarContentTemplate}
				</mo-avatar>
			</mo-list-item>

			<li divider role='separator'></li>
		`
	}

	private get avatarContentTemplate() {
		return this.user ? this.initials : html`
			<mo-icon-button icon='account_circle' @click=${() => Authentication.authenticateGloballyIfAvailable()}></mo-icon-button>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-user-avatar': UserAvatar
	}
}