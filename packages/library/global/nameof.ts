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

window.nameof = nameof