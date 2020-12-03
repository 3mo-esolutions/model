import { LitElement, PropertyValues } from 'lit-element'
import { Observer } from './Observer'
import { stylify } from './stylify'
import IComponent from './IComponent'
import { ComponentConstructor } from './Component'

export const componentize = <T extends Constructor<LitElement>>(Constructor: T) =>
	class extends stylify(Constructor) implements IComponent {
		['constructor']: ComponentConstructor

		static readonly observers = new Map<PropertyKey, Observer<any>>()

		readonly shadowRoot!: ShadowRoot
		readonly parentElement!: HTMLElement

		// @eventProperty readonly initialized!: IEvent

		protected firstUpdated(props: PropertyValues) {
			super.firstUpdated(props)
			this.initialized()
			// this.initialized.trigger()
		}

		protected updated(changedProperties: PropertyValues) {
			super.updated(changedProperties)
			changedProperties.forEach((value, _key) => {
				const key = _key as keyof this
				this.constructor.observers.get(key)?.call(this, this[key], value)
			})
		}

		protected initialized() {
			// Life-cycle callback after all elements are rendered for the first time
		}

		protected uninitialized() {
			// Life-cycle callback when this component is uninitializing
		}

		disconnectedCallback() {
			super.disconnectedCallback()
			this.removeAllEventListeners()
			this.uninitialized()
		}

		//#region Helpers
		switchAttribute(attribute: string, value: boolean) {
			if (value === false) {
				this.removeAttribute(attribute)
			} else {
				this.setAttribute(attribute, '')
			}
		}

		get childElements() {
			return Array.from(this.children) as Array<HTMLElement>
		}

		get isFirstChild() {
			return this.parentElement.firstChild === this
		}

		removeChildren() {
			this.childElements.forEach(child => child.remove())
		}
		//#endregion
	}