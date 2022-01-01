import { LitElement, PropertyValues } from 'lit'
import { StyleMixin } from '.'
import { ComponentConstructor } from '../../library'

export interface IComponent {
	['constructor']: ComponentConstructor
	readonly shadowRoot: ShadowRoot
}

export const ComponentMixin = <T extends Constructor<LitElement>>(Constructor: T) => {
	class ComponentMixinConstructor extends StyleMixin(Constructor) {
		static observers: Map<PropertyKey, Observer<any>>

		override['constructor']: ComponentConstructor

		override readonly shadowRoot!: ShadowRoot

		/** Invoked after first update i.e. render is completed */
		protected initialized() { }

		/** Invoked every time the component is connected to the Document Object Model (DOM) */
		protected connected() { }

		/** Invoked every time the component is disconnected from the Document Object Model (DOM) */
		protected disconnected() { }

		protected override firstUpdated(props: PropertyValues) {
			super.firstUpdated(props)
			this.initialized()
		}

		override connectedCallback() {
			super.connectedCallback()
			this.connected()
		}

		override disconnectedCallback() {
			super.disconnectedCallback()
			this.disconnected()
		}
	}
	return ComponentMixinConstructor
}