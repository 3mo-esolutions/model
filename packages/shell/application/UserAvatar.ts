import { state, html, component, Component, property, css } from '../../library'
import { User } from '..'

@component('mo-user-avatar')
export class UserAvatar extends Component {
	@property({ type: Object }) user?: User

	@state() private menuOpen = false

	static override get styles() {
		return css`
			:host {
				padding: 3px 0;
				display: flex;
			}

			mo-avatar {
				align-self: center;
				justify-self: center;
				color: var(--mo-color-foreground);
				background: rgba(0, 0, 0, 0.25);
			}

			mo-avatar:hover {
				cursor: pointer;
				background: rgba(0, 0, 0, calc(0.25 * 2));
			}
		`
	}

	private get name() {
		return this.user?.name.split(' ').map(string => string.charAt(0).toUpperCase() + string.slice(1)).join(' ')
	}

	private get initials() {
		return this.name
			?.split(' ')
			.map((s, i, array) => i === array.length - 1 || i === 0 ? s.charAt(0) : '')
			.join('')
	}

	protected override get template() {
		return html`
			<mo-avatar @click=${() => this.menuOpen = !this.menuOpen}>
				${this.avatarContent}
			</mo-avatar>

			<mo-menu .anchor=${this} corner='BOTTOM_START' activatable
				?open=${this.menuOpen}
				@opened=${() => this.menuOpen = true}
				@closed=${() => this.menuOpen = false}
			>
				<mo-list-item graphic='avatar' twoLine nonInteractive>
					<span>${this.name}</span>
					<span slot='secondary'>${this.user?.email}</span>
					<mo-avatar slot='graphic'>
						${this.avatarContent}
					</mo-avatar>
				</mo-list-item>

				<li divider role='separator'></li>

				<slot></slot>

				<li divider padded role='separator'></li>

				<mo-list-item icon='exit_to_app' disabled style='cursor: pointer; pointer-events: auto;'
					?hidden=${!MoDeL.application.authenticator || !MoDeL.application.authenticatedUser}
					@click=${() => MoDeL.application.unauthenticate()}
				>Sign out</mo-list-item>
			</mo-menu>
		`
	}

	private get avatarContent() {
		return this.user ? this.initials : html`
			<mo-icon-button icon='account_circle' @click=${() => MoDeL.application.authenticate()}></mo-icon-button>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-user-avatar': UserAvatar
	}
}