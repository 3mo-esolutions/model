import { CSSResult } from '../library'

export default new class DocumentHelper {
	constructor() {
		Object.defineProperty(document, 'deepActiveElement', {
			get: () => this.deepActiveElement,
			configurable: false
		})
	}

	injectCSS(styles: CSSResult, styleElement = document.createElement('style')) {
		styleElement.innerHTML = styles.cssText
		document.head.appendChild(styleElement)
		return styleElement
	}

	disableDefaultContextMenu() {
		document.body.oncontextmenu = () => false
	}

	get deepActiveElement() {
		return this.getDeepActiveElement()
	}

	private getDeepActiveElement(root: Document | ShadowRoot = document): Element | undefined {
		if (root.activeElement && root.activeElement.shadowRoot && root.activeElement.shadowRoot.activeElement) {
			return this.getDeepActiveElement(root.activeElement.shadowRoot)
		}
		return root.activeElement ?? undefined
	}
}

declare global {
	interface Document {
		readonly deepActiveElement: Element
	}
}