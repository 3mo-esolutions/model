if ('group' in Array.prototype === false) {
	Array.prototype.group = function (keySelector) {
		return this.reduce((storage, item) => {
			const group = keySelector(item);
			(storage[group] ||= []).push(item)
			return storage
		}, {})
	}
}

if ('groupToMap' in Array.prototype === false) {
	Array.prototype.groupToMap = function (keySelector) {
		return new Map(Object.entries(this.group(keySelector))) as any
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Array<T> {
	group<TKey extends keyof T, TValue extends T[TKey] & (string | number | symbol)>(keySelector: (item: T) => TValue): Record<TValue, Array<T>>
	groupToMap<TKey extends keyof T, TValue extends T[TKey] & (string | symbol)>(keySelector: (item: T) => TValue): Map<TValue, Array<T>>
}