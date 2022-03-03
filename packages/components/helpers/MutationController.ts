import { ReactiveController, ReactiveControllerHost } from '../../library'

export class MutationController extends ReactiveController<Node> {
	protected observer?: MutationObserver

	constructor(
		host: ReactiveControllerHost & Node,
		private readonly callback: MutationCallback,
		private readonly options: MutationObserverInit = { childList: true },
	) { super(host) }

	override hostConnected() {
		this.observer = new MutationObserver(this.callback)
		this.callback([], this.observer)
		this.observer.observe(this.host, this.options)
	}

	override hostDisconnected() {
		this.observer?.disconnect()
	}
}