// Refactor: SlotController can handle this.

Object.defineProperty(HTMLSlotElement.prototype, 'slottedElements', {
	get: function (this: HTMLSlotElement) {
		return getSlottedElements(this)
	}
})

function getSlottedElements(slotElement: HTMLSlotElement): Array<Element> {
	const assignedElements = slotElement.assignedElements()
	const defaultElements = [...slotElement.children]
	return assignedElements.length === 0
		? defaultElements
		: assignedElements.flatMap(e => e instanceof HTMLSlotElement ? getSlottedElements(e) : [e])
}

interface HTMLSlotElement {
	get slottedElements(): Array<Element>
}