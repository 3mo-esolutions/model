import { component, html } from '../../library'
import { Section } from './Section'

@component('mo-group-box')
export class GroupBox extends Section {
	protected override get headlineTemplate() {
		return html`
			<mo-headline part='header' width='*' typography='headline4'>${this.header}</mo-headline>
		`
	}

	protected override get contentTemplate() {
		return html`
			<mo-card part='card' height='*' direction=${this.direction} wrap=${this.wrap} gap=${this.gap}>
				<slot></slot>
			</mo-card>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-group-box': GroupBox
	}
}