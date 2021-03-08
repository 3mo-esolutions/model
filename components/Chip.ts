import { component, css } from '../library'
import { Button } from '.'

@component('mo-chip')
export class Chip extends Button {
	unelevated = true
	static get styles() {
		return css`
			${super.styles}

			:host {
				--mdc-theme-primary: rgba(var(--mo-color-foreground-base), 0.15);
				--mdc-theme-on-primary: rgba(var(--mo-color-foreground-base), 0.8);
				--mdc-shape-small: 100px;
				--mdc-button-horizontal-padding: 8px;
				--mdc-typography-button-text-transform: none;
			}

			#button {
				height: 30px;
				font-weight: auto !important;
				letter-spacing: normal !important;
				text-decoration: auto !important;
				text-transform: auto !important;
				padding-right: 4px;
			}
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-chip': Chip
	}
}