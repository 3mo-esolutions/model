import { component, html, property, Component, css } from '../../../library'
import { SplitterItem, CSSDirection } from '../..'
import * as CSS from 'csstype'

@component('mo-splitter')
export class Splitter extends Component {
	@property()
	get flexDirection() { return this.style.flexDirection as CSS.Property.FlexDirection }
	set flexDirection(value) { this.style.flexDirection = value }

	@property()
	get direction(): CSSDirection | undefined {
		switch (this.flexDirection) {
			case 'row':
				return 'horizontal'
			case 'column':
				return 'vertical'
			case 'row-reverse':
				return 'horizontal-reversed'
			case 'column-reverse':
				return 'vertical-reversed'
			default:
				return undefined
		}
	}
	set direction(value) {
		switch (value) {
			case 'horizontal':
				this.flexDirection = 'row'
				break
			case 'vertical':
				this.flexDirection = 'column'
				break
			case 'horizontal-reversed':
				this.flexDirection = 'row-reverse'
				break
			case 'vertical-reversed':
				this.flexDirection = 'column-reverse'
				break
		}
	}

	private _items = new Array<SplitterItem>()
	get items() { return this._items }
	set items(value) {
		this._items = value
		for (let i = 0; i < value.length; i++) {
			const item = value[i]

			item.calculateStyles(this.direction ?? 'vertical')

			if (i !== 0) {
				const divResizer = document.createElement('div')
				this.attachKnob(divResizer)
				this.insertBefore(divResizer, item)
				this.registerDragger(divResizer, this.items[i - 1], item, this.direction ?? 'vertical')
			}
		}
	}

	protected override initialized() {
		this.items = Array.from(this.querySelectorAll('mo-splitter-item')).filter(item => item.parentElement === this)
	}

	static override get styles() {
		return css`
			:host {
				display: flex;
				direction: column;
				flex-wrap: nowrap;
				flex-grow: 1;
				flex-basis: auto;
			}

			::slotted(.splitterResizer) {
				display: flex;
				background-color: transparent;
				user-select: none;
				align-items: center;
				justify-content: center;
				-webkit-user-select: none;
				-moz-user-select: none;
			}
		`
	}

	protected override get template() {
		return html`
			<slot></slot>
		`
	}

	private attachKnob(divResizer: HTMLDivElement) {
		divResizer.className = 'splitterResizer'
		const divKnob = document.createElement('div')
		divKnob.className = 'splitterResizerKnob'
		switch (this.direction) {
			case 'horizontal':
			case 'horizontal-reversed':
				divResizer.style.cursor = 'col-resize'
				divResizer.style.width = '5px'
				divResizer.style.height = '100%'
				divKnob.style.width = '4px'
				divKnob.style.height = '32px'
				break
			case 'vertical':
			case 'vertical-reversed':
				divResizer.style.cursor = 'row-resize'
				divResizer.style.width = '100%'
				divResizer.style.height = '5px'
				divKnob.style.width = '32px'
				divKnob.style.height = '4px'
				break
		}
		divKnob.style.borderRadius = '100px'
		divKnob.style.background = 'var(--mo-color-gray)'
		divResizer.appendChild(divKnob)
	}

	private registerDragger(separator: HTMLDivElement, previousElement: SplitterItem, nextElement: SplitterItem, direction: CSSDirection) {
		const isVertical = this.direction === 'vertical' || this.direction === 'vertical-reversed'

		let mouseDownInfo: {
			e: MouseEvent
			offsetLeft: number
			offsetTop: number
			firstSize: number
			secondSize: number
		}

		const onMouseDown = (e: MouseEvent) => {
			mouseDownInfo = {
				e,
				offsetLeft: separator.offsetLeft,
				offsetTop: separator.offsetTop,
				firstSize: isVertical ? previousElement.offsetHeight : previousElement.offsetWidth,
				secondSize: isVertical ? nextElement.offsetHeight : nextElement.offsetWidth
			}
			document.onmousemove = onMouseMove
			document.onmouseup = () => document.onmousemove = document.onmouseup = null
		}

		const onMouseMove = (e: MouseEvent) => {
			const delta = {
				x: e.clientX - mouseDownInfo.e.x,
				y: e.clientY - mouseDownInfo.e.y
			}

			delta.x = Math.min(Math.max(delta.x, -mouseDownInfo.firstSize), mouseDownInfo.secondSize)
			delta.y = Math.min(Math.max(delta.y, -mouseDownInfo.firstSize), mouseDownInfo.secondSize)

			let nextElementSize = 0
			let previousElementSize = 0
			switch (direction) {
				case 'horizontal':
				case 'horizontal-reversed':
					nextElementSize = mouseDownInfo.secondSize - delta.x
					previousElementSize = mouseDownInfo.firstSize + delta.x
					separator.style.left = `${mouseDownInfo.offsetLeft + delta.x}px`
					previousElement.style.width = `${previousElementSize}px`
					nextElement.style.width = `${nextElementSize}px`
					break
				case 'vertical':
				case 'vertical-reversed':
					nextElementSize = mouseDownInfo.secondSize - delta.y
					previousElementSize = mouseDownInfo.firstSize + delta.y
					separator.style.top = `${mouseDownInfo.offsetTop + delta.y}px`
					previousElement.style.height = `${previousElementSize}px`
					nextElement.style.height = `${nextElementSize}px`
					break
			}
		}

		if (nextElement === this.items[this.items.length - 1]) {
			nextElement.style.flex = '1'
		}

		separator.onmousedown = onMouseDown
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-splitter': Splitter
	}
}