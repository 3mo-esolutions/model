import { Component, component, html, ifDefined, property } from '../library'
import { ThemeHelper } from '..'

@component('mo-logo')
export class Logo extends Component {
	static source = '/assets/favicon.svg'

	@property() color = 'var(--mo-color-accessible)'

	protected initialized() {
		// Without this, the color of the logo isn't computed.
		// My guess is that the "computed styles" become available
		// after delegating to the event loop
		PromiseTask.delegateToEventLoop(() => this.requestUpdate())
		ThemeHelper.accent.changed.subscribe(() => this.requestUpdate())
	}

	protected render() {
		const color = this.color.includes('var(') ? getComputedStyle(MoDeL.application).getPropertyValue(this.colorPropertyName) : this.color
		return html`
			<style>
				:host {
					display: flex;
					justify-content: center;
					height: 100%
				}

				img {
					height: 100%
				}
			</style>
			<img src=${ifDefined(Logo.source?.replace('{{color}}', color))} />
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