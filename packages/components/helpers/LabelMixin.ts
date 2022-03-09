import { html, PropertyValues, query, property } from '../../library'
import { LitElement } from 'lit'
import '@material/mwc-formfield'

export const LabelMixin = <T extends Constructor<LitElement>>(Constructor: T) => {
	class LabelMixinConstructor extends Constructor {
		@property() label = ''

		@query('mwc-formfield') private readonly formFieldElement!: HTMLElement

		constructor(...parameters: Array<any>) {
			super(...parameters)
			if (this.innerText !== '') {
				this.label = this.innerText
			}
		}

		protected override render() {
			return html`
				<mwc-formfield label=${this.label} style='height: 100%;'>
					${super.render()}
				</mwc-formfield>
			`
		}

		protected override firstUpdated(changedProperties: PropertyValues) {
			super.firstUpdated(changedProperties)
			Object.defineProperty(this.formFieldElement, 'input', {
				get: function () { return this.querySelector('input') }
			})
		}
	}
	return LabelMixinConstructor
}