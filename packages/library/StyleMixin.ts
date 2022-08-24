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

export const StyleMixin = <T extends AbstractConstructor<HTMLElement>>(Constructor: T) => {
	abstract class StyleMixinConstructor extends Constructor {
		@property()
		get position() { return this.style.position as CSS.Property.Position }
		set position(value) { this.style.position = value }

		@property()
		get margin() { return this.style.margin as CSS.Property.Margin<string> }
		set margin(value) { this.style.margin = value }

		@property()
		get padding() { return this.style.padding as CSS.Property.Padding<string> }
		set padding(value) { this.style.padding = value }

		@property()
		get width() { return this.style.width as CSS.Property.Width<string> }
		set width(value) {
			if (CssHelper.isAsteriskSyntax(value)) {
				this.style.flexGrow = CssHelper.getFlexGrowFromAsteriskSyntax(value).toString()
				return
			}
			this.style.width = value
		}

		@property()
		get minWidth() { return this.style.minWidth as CSS.Property.MinWidth<string> }
		set minWidth(value) { this.style.minWidth = value }

		@property()
		get maxWidth() { return this.style.maxWidth as CSS.Property.MaxWidth<string> }
		set maxWidth(value) { this.style.maxWidth = value }

		@property()
		get height() { return this.style.height as CSS.Property.Height<string> }
		set height(value) {
			if (CssHelper.isAsteriskSyntax(value)) {
				this.style.flexGrow = CssHelper.getFlexGrowFromAsteriskSyntax(value).toString()
				return
			}
			this.style.height = value
		}

		@property()
		get minHeight() { return this.style.minHeight as CSS.Property.MinHeight<string> }
		set minHeight(value) { this.style.minHeight = value }

		@property()
		get maxHeight() { return this.style.maxHeight as CSS.Property.MaxHeight<string> }
		set maxHeight(value) { this.style.maxHeight = value }

		@property()
		get fontSize() { return this.style.fontSize as CSS.Property.FontSize<string> }
		set fontSize(value) { this.style.fontSize = value }

		@property()
		get fontWeight() { return this.style.fontWeight as CSS.Property.FontWeight }
		set fontWeight(value) { this.style.fontWeight = value.toString() }

		@property()
		get gridRow() { return this.style.gridRow as CSS.Property.GridRow }
		set gridRow(value) { this.style.gridRow = value.toString() }

		@property()
		get gridColumn() { return this.style.gridColumn as CSS.Property.GridColumn }
		set gridColumn(value) { this.style.gridColumn = value.toString() }

		@property()
		get textAlign() { return this.style.textAlign as CSS.Property.TextAlign | (string & {}) }
		set textAlign(value) { this.style.textAlign = value }

		@property()
		get border() { return this.style.border as CSS.Property.Border<string> }
		set border(value) { this.style.border = value }

		@property()
		get background() { return this.style.background as CSS.Property.Background<string> }
		set background(value) { this.style.background = value }

		@property()
		get foreground() { return this.style.color as CSS.Property.Color }
		set foreground(value) { this.style.color = value }

		@property()
		get justifyContent() { return this.style.justifyContent as CSS.Property.JustifyContent }
		set justifyContent(value) { this.style.justifyContent = value }

		@property()
		get alignItems() { return this.style.alignItems as CSS.Property.AlignItems }
		set alignItems(value) { this.style.alignItems = value }
	}
	return StyleMixinConstructor
}