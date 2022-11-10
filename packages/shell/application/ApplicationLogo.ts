import { Component, component, css, html, ifDefined, property } from '@a11d/lit'
import { ThemeHelper } from '..'

@component('mo-application-logo')
export class ApplicationLogo extends Component {
	static source?: string

	@property() color = 'var(--mo-color-accessible)'
	@property() source = ApplicationLogo.source

	protected override initialized() {
		ThemeHelper.accent.changed.subscribe(() => this.requestUpdate())
	}

	private async replaceColorVariable() {
		if (this.source?.includes('data:image/svg+xml;utf8,') === false) {
			return
		}
		const isColorCssVariable = this.color.includes('var(')
		const colorPropertyName = isColorCssVariable ? this.color.split('(')[1]!.substring(0, this.color.split('(')[1]!.length - 1) : ''
		let color = ''
		const tryCount = 10
		const failWaitTimeInMs = 10
		for (let i = 0; i < tryCount; i++) {
			color = isColorCssVariable ? getComputedStyle(MoDeL.application).getPropertyValue(colorPropertyName) : this.color
			if (color) {
				break
			}
			await Promise.sleep(failWaitTimeInMs)
		}
		this.source = this.source?.replaceAll('{{color}}', color)
	}

	static override get styles() {
		return css`
			:host {
				display: flex;
				justify-content: center;
				height: 100%
			}

			img, a {
				height: 100%;
			}
		`
	}

	protected override get template() {
		this.replaceColorVariable()
		return html`
			<a href='/'>
				<img src=${ifDefined(this.source)} />
			</a>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-application-logo': ApplicationLogo
	}
}