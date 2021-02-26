import { CSSResult } from '../library'

export default new class DocumentHelper {
	constructor() {
		Object.defineProperty(document, 'deepActiveElement', {
			get: () => this.deepActiveElement,
			configurable: false
		})
	}

	injectCSS(styles: CSSResult): void {
		const style = document.createElement('style')
		style.innerHTML = styles.cssText
		document.head.append(style)
	}

	linkCSS(uri: string) {
		const link = document.createElement('link')
		link.rel = 'stylesheet'
		link.type = 'text/css'
		link.href = uri
		document.head.append(link)
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