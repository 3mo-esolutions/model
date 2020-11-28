import { CSSResult } from '../library'

export default new class DocumentHelper {
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
}