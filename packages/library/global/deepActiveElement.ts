/* eslint-disable @typescript-eslint/no-unused-vars */

function getDeepActiveElement(root: Document | ShadowRoot = document): Element | undefined {
	if (root.activeElement?.shadowRoot?.activeElement) {
		return getDeepActiveElement(root.activeElement.shadowRoot)
	}
	return root.activeElement ?? undefined
}

Object.defineProperty(document, 'deepActiveElement', {
	get() {
		return this.getDeepActiveElement()
	},
	configurable: false
})

interface Document {
	readonly deepActiveElement?: Element
}