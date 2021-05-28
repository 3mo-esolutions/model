import { LitElement, PropertyValues } from 'lit-element'
import { Observer } from './Observer'
import { StyleMixin } from './StyleMixin'
import { ComponentConstructor } from './Component'
import { IComponent } from './IComponent'

export const ComponentMixin = <T extends Constructor<LitElement>>(Constructor: T) =>
	class extends StyleMixin(Constructor) implements IComponent {
		static observers: Map<PropertyKey, Observer<any>>

		override ['constructor']: ComponentConstructor

		override readonly shadowRoot!: ShadowRoot

		protected override firstUpdated(props: PropertyValues) {
			super.firstUpdated(props)
			this.initialized()
		}

		protected initialized() { }

		protected uninitialized() { }

		override disconnectedCallback() {
			super.disconnectedCallback()
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
			return this.parentElement?.firstChild === this
		}

		removeChildren() {
			this.childElements.forEach(child => child.remove())
		}
		//#endregion
	}