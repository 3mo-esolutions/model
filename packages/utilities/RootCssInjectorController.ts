import { CSSResult, ReactiveController, ReactiveControllerHost } from '@a11d/lit'

export class RootCssInjectorController implements ReactiveController {
	private readonly styleElement = document.createElement('style')

	constructor(root: ReactiveControllerHost, protected readonly rootStyle: CSSResult) {
		root.addController(this)
	}

	hostConnected() {
		RootCssInjector.inject(this.rootStyle, this.styleElement)
	}

	hostDisconnected() {
		this.styleElement.remove()
	}
}

export class RootCssInjector {
	static inject(styles: CSSResult, styleElement = document.createElement('style')) {
		styleElement.innerHTML = styles.cssText
		document.head.appendChild(styleElement)
		return styleElement
	}
}