import { ReactiveControllerHost } from '../library'
import { MutationController } from './MutationController'

export class SlotController extends MutationController {
	constructor(protected override readonly host: ReactiveControllerHost & HTMLElement, private readonly slotChangeCallback?: () => void) {
		super(host, () => this.handleChange(), { childList: true })
	}

	override hostConnected() {
		super.hostConnected()
		this.host.shadowRoot?.addEventListener('slotchange', this.handleChange)
	}

	override hostDisconnected() {
		super.hostDisconnected()
		this.host.shadowRoot?.removeEventListener('slotchange', this.handleChange)
	}

	private readonly handleChange = () => {
		this.host.requestUpdate()
		this.slotChangeCallback?.()
	}

	getAssignedElements(slotName: string) {
		return Array.from(this.host.childNodes)
			.filter(node => node.nodeType <= 2 || (node.nodeType === 3 && !!node.textContent?.trim()))
			.flatMap(child => child instanceof HTMLSlotElement ? child.assignedElements() : [child])
			.filter(child => (child instanceof HTMLElement && child.slot === slotName) || (!slotName && (child instanceof HTMLElement) === false))
	}

	hasSlottedElements(slotName: string) {
		// return this.host.querySelector(slotName ? `[slot="${slotName}"]` : ':not([slot])')
		return this.getAssignedElements(slotName).length > 0
	}
}