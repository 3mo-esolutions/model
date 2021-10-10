import { CSSResult } from '../library'

export class DocumentHelper {
	static injectCSS(styles: CSSResult, styleElement = document.createElement('style')) {
		styleElement.innerHTML = styles.cssText
		document.head.appendChild(styleElement)
		return styleElement
	}

	static disableDefaultContextMenu() {
		document.body.oncontextmenu = () => false
	}
}