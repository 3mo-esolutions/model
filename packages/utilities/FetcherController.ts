import { Controller, ReactiveControllerHost } from '@a11d/lit'
import { Debouncer, Enqueuer } from '.'

export type FetchableElementParameters = Record<string, unknown>

type Options<T> = {
	readonly fetcher?: () => Promise<T>
	readonly fetchEvent?: EventDispatcher<T>
}

export class FetcherController<T> extends Controller {
	protected readonly fetchEnqueuer = new Enqueuer<T>()
	protected readonly debouncer = new Debouncer()

	constructor(protected override readonly host: ReactiveControllerHost, protected readonly options?: Options<T>) {
		super(host)
	}

	debounce = 500

	protected _isFetching = false
	get isFetching() { return this._isFetching }
	protected set isFetching(value) {
		this._isFetching = value
		this.host.requestUpdate()
	}

	protected _data?: T
	get data() { return this._data }
	protected set data(value) {
		this._data = value
		this.host.requestUpdate()
	}

	private _fetchPromise?: Promise<T>
	get fetchPromise() { return this._fetchPromise }

	async fetch() {
		if (!this.options?.fetcher) {
			return undefined
		}
		this.isFetching = true
		await this.debouncer.debounce(this.debounce)
		this._fetchPromise = this.options.fetcher()
		this.data = await this.fetchEnqueuer.enqueue(this._fetchPromise)
		this.isFetching = false
		this.options.fetchEvent?.dispatch(this.data)
		return this.data
	}
}