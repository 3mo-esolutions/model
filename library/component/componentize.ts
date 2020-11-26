import { LitElement, PropertyValues } from 'lit-element'
import IComponent from './IComponent'
import { stylify } from './stylify'

export const componentize = <T extends Constructor<LitElement>>(Constructor: T) =>
	class extends stylify(Constructor) implements IComponent {
		readonly shadowRoot!: ShadowRoot
		readonly parentElement!: HTMLElement

		// @eventProperty readonly initialized!: IEvent

		protected firstUpdated(props: PropertyValues) {
			super.firstUpdated(props)
			this.initialized()
			// this.onInitialized.trigger()
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