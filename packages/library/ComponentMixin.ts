import { LitElement, PropertyValues } from 'lit'
import { StyleMixin } from '.'

export const ComponentMixin = <T extends AbstractConstructor<LitElement>>(Constructor: T) => {
	class ComponentMixinConstructor extends StyleMixin(Constructor) {
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