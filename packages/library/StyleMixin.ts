/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable import/no-internal-modules */
/* eslint-disable import/no-unresolved */
import { property } from 'lit/decorators.js'
import { LitElement } from 'lit'

const displayBeforeHiddenKey = Symbol('displayBeforeHidden')

property({ type: Boolean })(LitElement.prototype, 'hidden')
Object.defineProperty(LitElement.prototype, 'hidden', {
	get(this: LitElement) { return this.style.display === 'none' },
	set(this: LitElement, value: boolean) {
		if (value) {
			(this as any).displayBeforeHiddenKey = this.style.display
		}
		this.style.display = value ? 'none' : (this as any)[displayBeforeHiddenKey] ?? ''
	}
})