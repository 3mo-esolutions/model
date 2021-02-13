import { component, property, ComponentMixin, css } from '../../library'
import { MaterialIcon } from '../../types'
import { Fab as MwcFab } from '@material/mwc-fab'

/**
 * @attr mini
 * @attr disabled
 * @attr extended
 * @attr showIconAtEnd
 * @attr icon
 * @attr label
 * @slot icon
 */
@component('mo-fab')
export class Fab extends ComponentMixin(MwcFab) {
	@property() icon!: MaterialIcon
	@property({ type: Boolean, reflect: true }) scrollHide = false
	lastScrollElementTop = 0

	static get styles() {
		return css`
			${super.styles}

			:host {
				transition: var(--mo-fab-transition, var(--mo-duration-quick));
			}

			:host([scrollHide]) {
				transform: scale(0);
				opacity: 0;
			}
		`
	}

	constructor() {
		super()
		if (this.innerText !== '') {
			this.label = this.innerText
			this.extended = true
		}
	}

	protected initialized() {
		this.previousElementSibling?.addEventListener('scroll', (e: Event) => {
			const targetElement = e.composedPath()[0] as HTMLElement
			const scrollTop = targetElement.scrollTop
			const isUpScroll = scrollTop <= this.lastScrollElementTop
			this.scrollHide = !isUpScroll
			this.lastScrollElementTop = scrollTop <= 0 ? 0 : scrollTop
		}, { passive: true })
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-fab': Fab
	}
}