import { component, html, property, Component, css, styleMap, nothing, queryAll, ifDefined } from '../../../library'
import { SplitterItem, CSSDirection, MutationController, SplitterResizerHost } from '../..'
import * as CSS from 'csstype'

/**
 * @slot
 * @slot resizer
 */
@component('mo-splitter')
export class Splitter extends Component {
	private static readonly itemSlotPrefix = 'item-'

	@property() direction: CSSDirection = 'vertical'
	@property() gap?: CSS.Property.Gap<string>
	@property({ type: Boolean, reflect: true }) resizing = false
	@property({ type: Object }) resizerTemplate = html`<mo-splitter-resizer-knob></mo-splitter-resizer-knob>`

	@queryAll('mo-splitter-resizer-host') private readonly resizerElements!: Array<SplitterResizerHost>

	get items() {
		return Array.from(this.children).filter(c => c instanceof SplitterItem) as Array<SplitterItem>
	}

	protected readonly mutationController = new MutationController(this, () => {
		this.items.forEach((item, index) => item.slot = `${Splitter.itemSlotPrefix}${index}`)
		this.requestUpdate()
	})

	protected override connected() {
		window.addEventListener('mousemove', this.handleMouseMove)
	}

	protected override disconnected() {
		window.removeEventListener('mousemove', this.handleMouseMove)
	}

	static override get styles() {
		return css`
			:host {
				display: block;
				overflow: hidden;
			}

			:host([resizing]) {
				user-select: none;
			}

			slot {
				display: block;
				position: relative;
			}

			mo-splitter-resizer-host {
				z-index: 1;
			}
		`
	}

	protected override get template() {
		return html`
			<mo-flex height='100%' width='100%' wrap='nowrap' direction=${this.direction} gap=${ifDefined(this.gap)}>
				${this.items.map((item, index) => this.getItemTemplate(item, index))}
			</mo-flex>
		`
	}

	private getItemTemplate(item: SplitterItem, index: number) {
		const lastIndex = index === this.items.length - 1

		const styles = {
			'flex': lastIndex || item.size === undefined ? '1' : undefined,
			...(this.direction === 'horizontal' || this.direction === 'horizontal-reversed' ? {
				'width': item.size,
				'min-width': item.min,
				'max-width': item.max,
			} : {
				'height': item.size,
				'min-height': item.min,
				'max-height': item.max,
			})
		}
		return html`
			<slot name='${Splitter.itemSlotPrefix}${index}' style=${styleMap(styles)}></slot>
			${lastIndex ? nothing : this.resizerHostTemplate}
		`
	}

	private get resizerHostTemplate() {
		return html`
			<mo-splitter-resizer-host direction=${this.direction}
				@resizeStart=${() => this.resizing = true}
				@resizeStop=${() => this.resizing = false}
			>
				${this.resizerTemplate}
			</mo-splitter-resizer-host>
		`
	}

	private readonly handleMouseMove = (e: MouseEvent) => {
		const resizingResizer = this.resizerElements.find(r => r.resizing)
		const resizingItem = !resizingResizer ? undefined : this.items[this.resizerElements.indexOf(resizingResizer)]
		if (resizingItem) {
			const oldTotalSize = this.totalSize
			const { clientX, clientY } = e
			const { left, top, right, bottom } = resizingItem.getBoundingClientRect()

			const getSize = () => {
				switch (this.direction) {
					case 'horizontal':
						return clientX - left
					case 'horizontal-reversed':
						return right - clientX
					case 'vertical':
						return clientY - top
					case 'vertical-reversed':
						return bottom - clientY
				}
			}
			resizingItem.size = `${getSize() / oldTotalSize * 100}%`
		}
	}

	private get totalSize() {
		const clientRect = this.getBoundingClientRect()
		return this.isHorizontal ? clientRect.width : clientRect.height
	}

	private get isHorizontal() {
		return this.direction === 'horizontal' || this.direction === 'horizontal-reversed'
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-splitter': Splitter
	}
}