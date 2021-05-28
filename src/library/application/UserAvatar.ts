import { html, component, Component, property } from '..'
import { User } from '../../types'

@component('mo-user-avatar')
export class UserAvatar extends Component {
	@property({ type: Object }) user?: User

	protected override render = () => {
		if (this.user) {
			const initials = this.user.name.split(' ').map((s, i, array) => i === array.length - 1 || i === 0 ? s.charAt(0) : '')
			return html`
				<mo-grid rows='auto auto' columns='* 40px' width='auto' padding='0 4px 0 0' columnGap='10px' textAlign='right'>
					<mo-flex gridColumn='1' gridRow='1' fontSize='var(--mo-font-size-l)' justifyContent='flex-end'>${this.user.name}</mo-flex>
					<mo-flex gridColumn='1' gridRow='2' fontSize='var(--mo-font-size-m)'>${this.user.email}</mo-flex>
					<mo-flex gridColumn='2' gridRow='1 / span 2' height='40px' width='40px'
						alignSelf='center' justifySelf='center' justifyContent='center' alignItems='center'
						borderRadius='50%' background='rgba(0,0,0,0.3)' fontSize='var(--mo-font-size-l)'
					>${initials}</mo-flex>
				</mo-grid>
			`
		} else {
			return html`
				<mo-flex direction='horizontal' alignItems='center' justifyContent='center'>
					<mo-icon-button icon='account_circle' @click=${this.authenticate}></mo-icon-button>
				</mo-flex>
			`
		}
	}

	private readonly authenticate = () => MoDeL.application.authenticator?.confirm()
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-user-avatar': UserAvatar
	}
}