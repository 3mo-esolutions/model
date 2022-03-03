import { ReactiveController as LitReactiveController, ReactiveControllerHost } from 'lit'

export abstract class ReactiveController<T extends Node = Node> implements LitReactiveController {
	constructor(protected readonly host: ReactiveControllerHost & T) {
		this.host.addController(this)
	}

	hostConnected?(): void
	hostDisconnected?(): void
	hostUpdate?(): void
	hostUpdated?(): void
}