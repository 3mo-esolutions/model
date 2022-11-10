import { component, html, Component, css, property, event, query, eventListener } from '@a11d/lit'
import { CSSDirection, SplitterResizer } from '../..'

/**
 * @event resizeStart
 * @event resizeStop
 */
@component('mo-splitter-resizer-host')
export class SplitterResizerHost extends Component {
	@event() readonly resizeStart!: EventDispatcher
	@event() readonly resizeStop!: EventDispatcher

	@property({ reflect: true, updated(this: SplitterResizerHost) { !this.resizerElement ? void 0 : this.resizerElement.hostDirection = this.direction } }) direction?: CSSDirection
	@property({ type: Boolean, reflect: true }) resizing = false
	@property({ type: Boolean, reflect: true }) locked = false

	@query('slot') private readonly slotElement!: HTMLSlotElement

	get resizerElement() {
		return [...this.slotElement.slottedElements].find(e => e instanceof SplitterResizer) as SplitterResizer | undefined
	}

	@eventListener('mousedown')
	protected handleMouseDown() {
		this.resizing = true
		!this.resizerElement ? void 0 : this.resizerElement.hostResizing = true
		this.resizeStart.dispatch()
	}

	@eventListener({ target: window, type: 'mouseup' })
	protected handleWindowMouseUp() {
		this.resizing = false
		!this.resizerElement ? void 0 : this.resizerElement.hostResizing = false
		this.resizeStop.dispatch()
	}

	@eventListener('mouseenter')
	protected handleMouseEnter() {
		!this.resizerElement ? void 0 : this.resizerElement.hostHover = true
	}

	@eventListener('mouseleave')
	protected handleMouseLeave() {
		!this.resizerElement ? void 0 : this.resizerElement.hostHover = false
	}

	static override get styles() {
		return css`
			:host {
				display: flex;
				background-color: transparent;
				user-select: none;
				align-items: center;
				justify-content: center;
				-webkit-user-select: none;
				-moz-user-select: none;
				transition: var(--mo-duration-quick);
			}

			:host([locked]) {
				pointer-events: none;
				visibility: collapse;
			}

			:host([direction=horizontal]), :host([direction=horizontal-reversed]) {
				cursor: col-resize;
			}

			:host([direction=vertical]), :host([direction=vertical-reversed]) {
				cursor: row-resize;
			}
		`
	}

	override get template() {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-splitter-resizer-host': SplitterResizerHost
	}
}