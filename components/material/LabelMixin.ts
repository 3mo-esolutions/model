import { html, PropertyValues, query } from '../../library'
import { property, LitElement } from 'lit-element'
import '@material/mwc-formfield'

export const LabelMixin = <T extends Constructor<LitElement>>(Constructor: T) => {
	class LabelMixinConstructor extends Constructor {
		@property() label = ''

		constructor(...parameters: any[]) {
			super(...parameters)
			if (this.innerText !== '') {
				this.label = this.innerText
			}
		}

		protected render() {
			return html`
				<mwc-formfield label=${this.label}>
					${super.render()}
				</mwc-formfield>
			`
		}

		protected firstUpdated(changedProperties: PropertyValues) {
			super.firstUpdated(changedProperties)
			Object.defineProperty(this.formFieldElement, 'input', {
				get: function () { return this.querySelector('input') }
			})
		}

		@query('mwc-formfield') private readonly formFieldElement!: HTMLElement
	}
	return LabelMixinConstructor
}