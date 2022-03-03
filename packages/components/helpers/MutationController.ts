import { Controller, ReactiveControllerHost } from '../../library'

export class MutationController extends Controller {
	protected observer?: MutationObserver

	constructor(
		protected override readonly host: ReactiveControllerHost & Node,
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