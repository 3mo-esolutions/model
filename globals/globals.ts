/* eslint-disable */

type Constructor<T> = { new(...args: any[]): T }

function Constructor<T = unknown>(Constructor: Constructor<T>) {
	return Constructor as Constructor<T>
}

window.Constructor = Constructor

type ParameterIndex<T extends (...args: any) => any, I extends number> = Parameters<T>[I]

type FirstParameter<T extends (...args: any) => any> = ParameterIndex<T, 0>