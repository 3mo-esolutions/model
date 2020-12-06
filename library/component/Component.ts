import { LitElement } from 'lit-element'
import { ComponentMixin } from '.'
import { Observer } from './Observer'

export interface ComponentConstructor extends Constructor<Component> {
	observers: Map<PropertyKey, Observer<any>>
}

export default abstract class Component extends ComponentMixin(LitElement) { }