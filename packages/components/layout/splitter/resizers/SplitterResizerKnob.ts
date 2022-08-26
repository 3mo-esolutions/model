import { component, css } from '../../../../library'
import { SplitterResizer } from '.'

@component('mo-splitter-resizer-knob')
export class SplitterResizerKnob extends SplitterResizer {
	static override get styles() {
		return css`
			:host {
				transition: 0.2s;
				background: var(--mo-color-gray);
				border-radius: 10px;
				align-self: center;
			}

			:host([hostHover]), :host([hostResizing]) {
				background: var(--mo-color-accent);
			}

			:host([hostDirection=vertical]), :host([hostDirection=vertical-reversed]) {
				width: 32px;
				height: 4px;
				margin: 2px 0;
			}

			:host([hostDirection=horizontal]) , :host([hostDirection=horizontal-reversed]) {
				height: 32px;
				width: 4px;
				margin: 0 2px;
			}

			:host([hostDirection=vertical][hostHover]), :host([hostDirection=vertical][hostResizing]), :host([hostDirection=vertical-reversed][hostHover]), :host([hostDirection=vertical-reversed][hostResizing]) {
				transform: scaleY(1.5);
			}

			:host([hostDirection=horizontal][hostHover]), :host([hostDirection=horizontal][hostResizing]), :host([hostDirection=horizontal-reversed][hostHover]), :host([hostDirection=horizontal-reversed][hostResizing]) {
				transform: scaleX(1.5);
			}
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-splitter-resizer-knob': SplitterResizerKnob
	}
}