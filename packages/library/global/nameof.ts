/* eslint-disable @typescript-eslint/ban-types */

type KeyPathOf<T> =
	object extends T ? string :
	T extends ReadonlyArray<any> ? Extract<keyof T, `${number}`> | SubKeyPathOf<T, Extract<keyof T, `${number}`>> :
	T extends object ? Extract<keyof T, string> | SubKeyPathOf<T, Extract<keyof T, string>> :
	never

type SubKeyPathOf<T, K extends string> = K extends keyof T ? `${K}.${KeyPathOf<T[K]>}` : never

function nameof<T>(keyPath: KeyPathOf<T>) {
	return keyPath
}

type KeyPathValueOf<T, KeyPath extends string = KeyPathOf<T>> =
	KeyPath extends keyof T ? T[KeyPath] :
	KeyPath extends `${infer K}.${infer R}` ? K extends keyof T ? KeyPathValueOf<T[K], R> : unknown :
	unknown

function getPropertyByKeyPath<T, KeyPath extends KeyPathOf<T>>(object: T, keyPath: KeyPath): KeyPathValueOf<T, KeyPath> {
	return keyPath.split('.').reduce((value: any, key) => value === undefined || value === null ? value : value[key], object)
}

function setPropertyByKeyPath<T, KeyPath extends KeyPathOf<T>>(object: T, keyPath: KeyPath, value: KeyPathValueOf<T, KeyPath>) {
	const keys = keyPath.split('.')
	const lastKey = keys[keys.length - 1]
	const otherKeysButLast = keys.slice(0, keys.length - 1)
	const lastObject = getPropertyByKeyPath(object, otherKeysButLast.join('.') as KeyPath) ?? object as any
	if (lastObject !== undefined || lastObject !== null) {
		lastObject[lastKey] = value
	}
}

window.nameof = nameof
window.getPropertyByKeyPath = getPropertyByKeyPath
window.setPropertyByKeyPath = setPropertyByKeyPath