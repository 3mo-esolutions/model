/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable import/no-internal-modules */
/* eslint-disable import/no-unresolved */
import { property } from 'lit/decorators.js'
import { LitElement } from 'lit'
import * as CSS from 'csstype'
import { CssHelper } from '../..'

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

property({ type: String })(LitElement.prototype, 'width')
Object.defineProperty(LitElement.prototype, 'width', {
	get(this: LitElement) { return this.style.width as CSS.Property.Width<string> },
	set(this: LitElement, value: string) {
		if (CssHelper.isAsteriskSyntax(value)) {
			this.style.flexGrow = CssHelper.getFlexGrowFromAsteriskSyntax(value).toString()
			return
		}
		this.style.width = value
	}
})

property({ type: String })(LitElement.prototype, 'height')
Object.defineProperty(LitElement.prototype, 'height', {
	get(this: LitElement) { return this.style.height as CSS.Property.Height<string>  },
	set(this: LitElement, value: string) {
		if (CssHelper.isAsteriskSyntax(value)) {
			this.style.flexGrow = CssHelper.getFlexGrowFromAsteriskSyntax(value).toString()
			return
		}
		this.style.height = value
	}
})