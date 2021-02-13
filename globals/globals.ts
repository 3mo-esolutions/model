// TODO: wait for TypeScript 4.2 release (23rd February)
// type AbstractConstructor<T> = abstract new (...args: Array<any>) => T

// function AbstractConstructor<T = unknown>(Constructor: Constructor<T>) {
// 	return Constructor as AbstractConstructor<T>
// }

// window.AbstractConstructor = AbstractConstructor

type Constructor<T> = new (...args: Array<any>) => T

function Constructor<T = unknown>(Constructor: Constructor<T>) {
	return Constructor as Constructor<T>
}

window.Constructor = Constructor

type ParameterIndex<T extends (...args: any) => any, I extends number> = Parameters<T>[I]

type FirstParameter<T extends (...args: any) => any> = ParameterIndex<T, 0>