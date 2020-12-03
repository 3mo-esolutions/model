import { LitElement } from 'lit-element'
import { componentize } from '.'

type Observer<T> = (value: T, oldValue: T) => void

export interface ComponentConstructor extends Constructor<Component> {
	observers: Map<PropertyKey, Observer<any>>
}

export default abstract class Component extends componentize(LitElement) {
	['constructor']: ComponentConstructor
	static observers = new Map<PropertyKey, Observer<any>>()
}