import { state, html, component, Component, property, css } from '..'
import { User } from '../../types'

@component('mo-user-avatar')
export class UserAvatar extends Component {
	@property({ type: Object }) user?: User

	@state() private menuOpen = false

	static override get styles() {
		return css`
			:host {
				height: 100%;
				width: 100%;
				display: flex;
			}

			mo-flex {
				height: 40px;
				width: 40px;
				align-self: center;
				justify-self: center;
				justify-content: center;
				align-items: center;
				border-radius: 50%;
				background: rgba(0, 0, 0, 0.25);
				font-size: var(--mo-font-size-l);
			}

			mo-flex:hover {
				cursor: pointer;
				background: rgba(0, 0, 0, 0.5);
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
			<mo-flex @click=${() => this.menuOpen = !this.menuOpen}>
				${this.user ? this.initials : html`
					<mo-icon-button icon='account_circle' @click=${MoDeL.application.authenticate}></mo-icon-button>
				`}
			</mo-flex>

			<mo-menu .anchor=${this} corner='BOTTOM_START' activatable ?open=${this.menuOpen} @opened=${() => this.menuOpen = true} @closed=${() => this.menuOpen = false}>
				<mo-list-item graphic='avatar' twoLine nonInteractive>
					<span>${this.name}</span>
					<span slot='secondary'>${this.user?.email}</span>
					<mo-icon slot='graphic' icon='tag_faces'></mo-icon>
				</mo-list-item>

				<li divider role='separator'></li>

				<slot></slot>

				<li divider padded role='separator'></li>

				<mo-list-item icon='exit_to_app' disabled style='cursor: pointer; pointer-events: auto;'
					?hidden=${!MoDeL.application.authenticator || !MoDeL.application.authenticatedUser}
					@click=${MoDeL.application.unauthenticate}
				>Sign out</mo-list-item>
			</mo-menu>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-user-avatar': UserAvatar
	}
}