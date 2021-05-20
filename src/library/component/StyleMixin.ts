/* eslint-disable @typescript-eslint/ban-types */
import { property } from 'lit-element'
import { IStyledElement } from './IStyledElement'
import * as CSS from 'csstype'

export const StyleMixin = <T extends Constructor<HTMLElement>>(Constructor: T) => {
	abstract class StyleMixinConstructor extends Constructor implements IStyledElement {
		@property()
		get display() { return this.style.display as CSS.Property.Display }
		set display(value) { this.style.display = value }

		displayBeforeHidden?: CSS.Property.Display

		@property({ type: Boolean })
		get hidden() { return this.display === 'none' }
		set hidden(value) {
			if (value) {
				this.displayBeforeHidden = this.display
			}
			this.display = value ? 'none' : this.displayBeforeHidden ?? ''
		}

		@property()
		get opacity() { return this.style.opacity as CSS.Property.Opacity }
		set opacity(value) { this.style.opacity = value.toString() }

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
		get cursor() { return this.style.cursor as CSS.Property.Cursor }
		set cursor(value) { this.style.cursor = value }

		@property()
		get width() { return this.style.width as CSS.Property.Width<string> }
		set width(value) {
			if (isAsteriskSyntax(value)) {
				this.flexGrow = getFlexGrowFromAsteriskSyntax(value).toString()
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
			if (isAsteriskSyntax(value)) {
				this.flexGrow = getFlexGrowFromAsteriskSyntax(value).toString()
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
		get right() { return this.style.right as CSS.Property.Right<string> }
		set right(value) { this.style.right = value }

		@property()
		get left() { return this.style.left as CSS.Property.Left<string> }
		set left(value) { this.style.left = value }

		@property()
		get top() { return this.style.top as CSS.Property.Top<string> }
		set top(value) { this.style.top = value }

		@property()
		get bottom() { return this.style.bottom as CSS.Property.Bottom<string> }
		set bottom(value) { this.style.bottom = value }

		@property()
		get fontSize() { return this.style.fontSize as CSS.Property.FontSize<string> }
		set fontSize(value) { this.style.fontSize = value }

		@property()
		get fontWeight() { return this.style.fontWeight as CSS.Property.FontWeight }
		set fontWeight(value) { this.style.fontWeight = value.toString() }

		@property()
		get lineHeight() { return this.style.lineHeight as CSS.Property.LineHeight<string> }
		set lineHeight(value) { this.style.lineHeight = value.toString() }

		@property()
		get flexGrow() { return this.style.flexGrow as CSS.Property.FlexGrow | (string | {}) }
		set flexGrow(value) { this.style.flex = `${value} 0 0` }

		@property()
		get flexBasis() { return this.style.flexBasis as CSS.Property.FlexBasis<string> }
		set flexBasis(value) { this.style.flexBasis = value }

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
		get borderRadius() { return this.style.borderRadius as CSS.Property.BorderRadius<string> }
		set borderRadius(value) { this.style.borderRadius = value }

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
		get justifyItems() { return this.style.justifyItems as CSS.Property.JustifyItems }
		set justifyItems(value) { this.style.justifyItems = value }

		@property()
		get justifySelf() { return this.style.justifySelf as CSS.Property.JustifySelf }
		set justifySelf(value) { this.style.justifySelf = value }

		@property()
		get alignContent() { return this.style.alignContent as CSS.Property.AlignContent }
		set alignContent(value) { this.style.alignContent = value }

		@property()
		get alignItems() { return this.style.alignItems as CSS.Property.AlignItems }
		set alignItems(value) { this.style.alignItems = value }

		@property()
		get alignSelf() { return this.style.alignSelf as CSS.Property.AlignSelf }
		set alignSelf(value) { this.style.alignSelf = value }

		@property()
		get userSelect() { return this.style.userSelect as CSS.Property.UserSelect }
		set userSelect(value) { this.style.userSelect = value }
	}
	return StyleMixinConstructor
}

function isAsteriskSyntax(length: string) {
	return (length.includes('*') === true && length.includes('calc') === false)
}
function getFlexGrowFromAsteriskSyntax(length: string) {
	return length === '*'
		? 1
		: parseInt(length.split('*')[0])
}