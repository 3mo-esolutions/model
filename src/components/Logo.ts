import { Component, component, css, html, ifDefined, property } from '../library'
import { ThemeHelper } from '..'

@component('mo-logo')
export class Logo extends Component {
	static source = '/assets/favicon.svg'

	@property() color = 'var(--mo-color-accessible)'

	protected override initialized() {
		// Without this, the color of the logo isn't computed.
		// My guess is that the "computed styles" become available
		// after delegating to the event loop
		PromiseTask.delegateToEventLoop(() => this.requestUpdate())
		ThemeHelper.accent.changed.subscribe(() => this.requestUpdate())
	}

	static override get styles() {
		return css`
			:host {
				display: flex;
				justify-content: center;
				height: 100%
			}

			img, a {
				height: 100%
			}
		`
	}

	protected override get template() {
		const color = this.color.includes('var(') ? getComputedStyle(MoDeL.application).getPropertyValue(this.colorPropertyName) : this.color
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		const source = Logo.source?.replace('{{color}}', color)
		return html`
			<a href='/'>
				<img src=${ifDefined(source)} />
			</a>
		`
	}

	private get colorPropertyName() {
		return this.color.split('(')[1].substring(0, this.color.split('(')[1].length - 1)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-logo': Logo
	}
}