import { Controller, ReactiveControllerHost } from '../library'

export class MutationController extends Controller {
	protected observer?: MutationObserver

	constructor(
		protected override readonly host: ReactiveControllerHost & Node,
		private readonly mutationCallback: MutationCallback,
		private readonly options: MutationObserverInit = { childList: true },
	) { super(host) }

	override hostConnected() {
		this.observer = new MutationObserver(this.mutationCallback)
		this.mutationCallback([], this.observer)
		this.observer.observe(this.host, this.options)
	}

	override hostDisconnected() {
		this.observer?.disconnect()
	}
}