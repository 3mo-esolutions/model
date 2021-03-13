import { PureEvent } from '../types'
import { JsonHelper } from '.'

export class LocalStorageContainer {
	static readonly changed = new PureEvent<unknown>()

	private static readonly container = new Array<LocalStorageEntry<any>>()

	static updateAll() {
		this.container.forEach(storageConfig => storageConfig.value = storageConfig.value)
	}

	static push(entry: LocalStorageEntry<any>) {
		this.container.push(entry)
	}
}

export default class LocalStorageEntry<T> {
	readonly changed = new PureEvent<any>()

	constructor(
		protected readonly name: string,
		protected readonly defaultValue: T,
		protected readonly reviver?: (key: string, value: any) => any
	) {
		LocalStorageContainer.push(this)
	}

	get value(): T {
		const value = window.localStorage.getItem(this.name) ?? undefined
		if (value === undefined || value === 'undefined')
			return this.defaultValue
		return JsonHelper.isJson(value) ? JSON.parse(value, this.reviver) : value
	}

	set value(obj: T) {
		window.localStorage.setItem(this.name, JSON.stringify(obj))
		this.changed.dispatch(obj)
		LocalStorageContainer.changed.dispatch(this)
	}
}