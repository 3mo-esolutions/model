import { component, css, html, style } from '@a11d/lit'
import { Section } from './Section'

/**
 * @slot footer
 */
@component('mo-group-box')
export class GroupBox extends Section {
	static override get styles() {
		return css`
			${super.styles}

			mo-card > mo-flex {
				height: 100%;
			}
		`
	}

	protected override get headingTemplate() {
		return html`
			<mo-heading part='heading' typography='heading4' ${style({ width: '*' })}>${this.heading}</mo-heading>
		`
	}

	protected override get contentTemplate() {
		return html`
			<mo-card part='card' ${style({ height: '*' })}>
				${super.contentTemplate}
				<slot slot='footer' name='footer'></slot>
			</mo-card>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-group-box': GroupBox
	}
}