/* eslint-disable */

type Constructor<T> = { new(...args: any[]): T }

function Constructor<T = unknown>(Constructor: Constructor<T>) {
	return Constructor as Constructor<T>
}

window.Constructor = Constructor