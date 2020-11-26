import LocalStorageEntry from './LocalStorage'

export default <T>(pName: string, pDefaultValue: T) => {
	return class extends LocalStorageEntry<T> {
		constructor(
			protected readonly name: string = pName,
			protected readonly defaultValue: T = pDefaultValue
		) {
			super(name, defaultValue)
		}
	}
}