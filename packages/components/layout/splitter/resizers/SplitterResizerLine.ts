import { component, css } from '../../../../library'
import { SplitterResizer } from '.'

@component('mo-splitter-resizer-line')
export class SplitterResizerLine extends SplitterResizer {
	static override get styles() {
		return css`
			:host {
				transition: var(--mo-duration-quick);
				background: var(--mo-splitter-resizer-line-idle-background, var(--mo-color-gray-transparent));
			}

			:host([hostHover]), :host([hostResizing]) {
				background: var(--mo-color-accent);
			}

			:host([hostDirection=vertical]), :host([hostDirection=vertical-reversed]) {
				width: 100%;
				height: var(--mo-splitter-resizer-line-thickness, 2px);
			}

			:host([hostDirection=horizontal]), :host([hostDirection=horizontal-reversed]) {
				height: 100%;
				width: var(--mo-splitter-resizer-line-thickness, 2px);
			}

			:host([hostDirection=vertical][hostHover]), :host([hostDirection=vertical][hostResizing]), :host([hostDirection=vertical-reversed][hostHover]), :host([hostDirection=vertical-reversed][hostResizing]) {
				transform: var(--mo-splitter-resizer-line-vertical-transform, scaleY(2));
			}

			:host([hostDirection=horizontal][hostHover]), :host([hostDirection=horizontal][hostResizing]), :host([hostDirection=horizontal-reversed][hostHover]), :host([hostDirection=horizontal-reversed][hostResizing]) {
				transform: var(--mo-splitter-resizer-line-horizontal-transform, scaleX(2));
			}
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-splitter-resizer-line': SplitterResizerLine
	}
}