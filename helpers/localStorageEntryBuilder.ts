import LocalStorageEntry from './LocalStorage'

export default <T>(pName: string, pDefaultValue: T, pReviver?: (key: string, value: any) => any) => {
	return class extends LocalStorageEntry<T> {
		constructor(
			protected readonly name = pName,
			protected readonly defaultValue = pDefaultValue,
			protected readonly reviver = pReviver,
		) {
			super(name, defaultValue, reviver)
		}
	}
}