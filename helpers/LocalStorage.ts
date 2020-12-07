import { JsonHelper } from '.'

export class LocalStorageContainer {
	static readonly changed = new PureEvent<any>()

	private static readonly container = new Array<LocalStorageEntry<any>>()

	static updateAll() {
		this.container.forEach(storageConfig => storageConfig.value = storageConfig.value)
	}

	static push(entry: LocalStorageEntry<any>) {
		this.container.push(entry)
	}
}

export default class LocalStorageEntry<T> {
	readonly changed = new PureEvent<T>()

	constructor(
		protected readonly name: string,
		protected readonly defaultValue: T
	) {
		LocalStorageContainer.push(this)
		setTimeout(() => this.value = this.value, 1)
	}

	get value(): T {
		const value = window.localStorage.getItem(this.name) ?? undefined
		if (value === undefined || value === 'undefined')
			return this.defaultValue
		return JsonHelper.isJson(value) ? JSON.parse(value) : value
	}

	set value(obj: T) {
		window.localStorage.setItem(this.name, JSON.stringify(obj))
		this.changed.trigger(obj)
		LocalStorageContainer.changed.trigger(this)
	}
}