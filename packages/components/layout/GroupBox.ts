import { component, css, html } from '../../library'
import { Section } from './Section'

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
			<mo-heading part='heading' width='*' typography='heading4'>${this.heading}</mo-heading>
		`
	}

	protected override get contentTemplate() {
		return html`
			<mo-card part='card' height='*'>
				${super.contentTemplate}
			</mo-card>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-group-box': GroupBox
	}
}