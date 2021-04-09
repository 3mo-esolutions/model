type AbstractConstructor<T> = abstract new (...args: Array<any>) => T

function AbstractConstructor<T = unknown>(Constructor: Constructor<T>) {
	return Constructor as AbstractConstructor<T>
}

globalThis.AbstractConstructor = AbstractConstructor

type Constructor<T> = new (...args: Array<any>) => T

function Constructor<T = unknown>(Constructor: Constructor<T>) {
	return Constructor as Constructor<T>
}

globalThis.Constructor = Constructor

type ParameterIndex<T extends (...args: any) => any, I extends number> = Parameters<T>[I]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type FirstParameter<T extends (...args: any) => any> = ParameterIndex<T, 0>