import { LitElement } from 'lit-element'
import { componentize } from '.'
import { Observer } from './Observer'

export interface ComponentConstructor extends Constructor<Component> {
	readonly observers: Map<PropertyKey, Observer<any>>
}

export default abstract class Component extends componentize(LitElement) { }