import { LitElement, PropertyValues } from 'lit-element'
import { Observer } from './Observer'
import { StyleMixin } from './StyleMixin'
import IComponent from './IComponent'
import { ComponentConstructor } from './Component'

export const ComponentMixin = <T extends Constructor<LitElement>>(Constructor: T) =>
	class extends StyleMixin(Constructor) implements IComponent {
		['constructor']: ComponentConstructor

		static observers: Map<PropertyKey, Observer<any>>

		readonly shadowRoot!: ShadowRoot
		readonly parentElement!: HTMLElement

		// @eventProperty readonly initialized!: IEvent

		protected firstUpdated(props: PropertyValues) {
			super.firstUpdated(props)
			this.initialized()
			// this.initialized.trigger()
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