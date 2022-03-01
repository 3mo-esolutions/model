import { html, component, Component, property, nothing, css } from '../../library'
import { MaterialIcon } from '.'

@component('mo-error')
export class Error extends Component {
	@property() icon?: MaterialIcon

	static override get styles() {
		return css`
			:host {
				display: flex;
			}

			:host, mo-flex {
				align-items: center;
				justify-content: center;
				text-align: center;
			}
		`
	}

	protected override get template() {
		return html`
			<mo-flex gap='var(--mo-thickness-l)' foreground='var(--mo-color-gray)'>
				${!this.icon ? nothing : html`<mo-icon fontSize='48px' icon=${this.icon}></mo-icon>`}
				<mo-heading fontWeight='600'>
					<slot></slot>
				</mo-heading>
			</mo-flex>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-error': Error
	}
}