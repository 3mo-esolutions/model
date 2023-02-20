import { component, property } from '@a11d/lit'
import { LoadingDialog } from '@3mo/loading-dialog'
import { FetcherController } from '../../utilities'

@component('mo-fetchable-dialog')
export class FetchableDialog<T> extends LoadingDialog {
	@property({ type: Object, updated(this: FetchableDialog<T>) { this.fetcherController.fetch() } }) fetch!: () => T | PromiseLike<T>

	readonly fetcherController = new FetcherController(this, {
		fetcher: () => this.fetch()
	})

	protected override get isLoading() {
		return this.fetcherController.isFetching || super.isLoading
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-fetchable-dialog': FetchableDialog<unknown>
	}
}