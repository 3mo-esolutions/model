import { component, html, property, Component, css, styleMap, nothing, queryAll, ifDefined, eventListener, style } from '@a11d/lit'
import { SplitterItem, CSSDirection, SplitterResizerHost } from '../..'
import { MutationController } from '@3mo/mutation-observer'
import type * as CSS from 'csstype'

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

	protected readonly mutationController = new MutationController(this, {
		config: { childList: true },
		callback: () => {
			this.items.forEach((item, index) => item.slot = `${Splitter.itemSlotPrefix}${index}`)
			this.requestUpdate()
		}
	})

	static override get styles() {
		return css`
			:host {
				display: block;
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

	@eventListener({ target: window, type: 'mousemove' })
	protected handleMouseMove(e: MouseEvent) {
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

	protected override get template() {
		return html`
			<mo-flex ${style({ height: '100%', width: '100%' })} wrap='nowrap' direction=${this.direction} gap=${ifDefined(this.gap)}>
				${this.items.map((item, index) => this.getItemTemplate(item, index))}
			</mo-flex>
		`
	}

	private getItemTemplate(item: SplitterItem, index: number) {
		const styles = {
			'flex': index === this.items.length - 1 || item.size === undefined ? '1' : undefined,
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
			${this.getResizerHostTemplate(item, index)}
		`
	}

	private getResizerHostTemplate(item: SplitterItem, index: number) {
		return index === this.items.length - 1 ? nothing : html`
			<mo-splitter-resizer-host part='resizer-host'
				?locked=${item.locked}
				direction=${this.direction}
				@resizeStart=${() => this.resizing = true}
				@resizeStop=${() => this.resizing = false}
			>
				${this.resizerTemplate}
			</mo-splitter-resizer-host>
		`
	}

	private get totalSize() {
		const clientRect = this.getBoundingClientRect()
		return this.direction === 'horizontal' || this.direction === 'horizontal-reversed'
			? clientRect.width
			: clientRect.height
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-splitter': Splitter
	}
}