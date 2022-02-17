import { ReactiveController, ReactiveControllerHost } from '../../library'

export class TextContentController implements ReactiveController {
	protected observer?: MutationObserver

	constructor(
		private readonly host: ReactiveControllerHost & Node,
		private readonly textContentChanged: (textContent: string) => void,
		private readonly options: MutationObserverInit = {
			subtree: true,
			characterData: true,
			childList: true,
		}
	) { this.host.addController(this) }

	hostConnected() {
		this.textContentChanged(this.textContent)
		this.observer = new MutationObserver(() => this.textContentChanged(this.textContent))
		this.observer.observe(this.host, this.options)
	}

	hostDisconnected() {
		this.observer?.disconnect()
	}

	private get textContent() {
		return this.host.textContent?.trim() ?? ''
	}
}