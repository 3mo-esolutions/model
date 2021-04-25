/* eslint-disable */
import * as CSS from 'csstype'

namespace MoDeL.Styles {
	export type FontSize =
		| 'var(--mo-font-size-xxxs)'
		| 'var(--mo-font-size-xxs)'
		| 'var(--mo-font-size-xs)'
		| 'var(--mo-font-size-s)'
		| 'var(--mo-font-size-m)'
		| 'var(--mo-font-size-l)'
		| 'var(--mo-font-size-xl)'
		| 'var(--mo-font-size-xxl)'
		| 'var(--mo-font-size-xxxl)'
		| 'var(--mo-font-size-icon)'

	export type Thickness =
		| 'var(--mo-thickness-xs)'
		| 'var(--mo-thickness-s)'
		| 'var(--mo-thickness-m)'
		| 'var(--mo-thickness-l)'
		| 'var(--mo-thickness-xl)'
		| 'var(--mo-thickness-xxl)'

	export type Length = '*'

	export type BorderRadius = 'var(--mo-border-radius)'

	export type Color =
		| 'var(--mo-accent)'
		| 'var(--mo-accent-transparent)'
		| 'var(--mo-accent-gradient)'
		| 'var(--mo-accent-gradient-transparent)'
		| 'var(--mo-color-background)'
		| 'var(--mo-color-error)'
		| 'var(--mo-color-accessible)'
		| 'var(--mo-color-foreground)'
		| 'var(--mo-color-foreground-transparent)'
		| 'var(--mo-color-surface)'
		| 'var(--mo-alternating-background)'
		| 'var(--mo-color-gray)'
		| 'var(--mo-color-gray-transparent)'
}

export interface IStyledElement {
	/** @attr */ display: CSS.Property.Display
	/** @attr */ hidden: boolean
	/** @attr */ position: CSS.Property.Position
	/** @attr */ margin: CSS.Property.Margin<string> | MoDeL.Styles.Thickness
	/** @attr */ padding: CSS.Property.Padding<string> | MoDeL.Styles.Thickness
	/** @attr */ cursor: CSS.Property.Cursor
	/** @attr */ width: CSS.Property.Width<string> | MoDeL.Styles.Length
	/** @attr */ minWidth: CSS.Property.MinWidth<string>
	/** @attr */ maxWidth: CSS.Property.MaxWidth<string>
	/** @attr */ height: CSS.Property.Height<string> | MoDeL.Styles.Length
	/** @attr */ minHeight: CSS.Property.MinHeight<string>
	/** @attr */ maxHeight: CSS.Property.MaxHeight<string>
	/** @attr */ fontSize: CSS.Property.FontSize | MoDeL.Styles.FontSize
	/** @attr */ fontWeight: CSS.Property.FontWeight
	/** @attr */ lineHeight: CSS.Property.LineHeight
	/** @attr */ flexGrow: CSS.Property.FlexGrow | (string | {})
	/** @attr */ flexBasis: CSS.Property.FlexBasis<string>
	/** @attr */ gridRow: CSS.Property.GridRow
	/** @attr */ gridColumn: CSS.Property.GridColumn
	/** @attr */ textAlign: CSS.Property.TextAlign | (string | {})
	/** @attr */ border: CSS.Property.Border<string>
	/** @attr */ borderRadius: CSS.Property.BorderRadius<string> | MoDeL.Styles.BorderRadius
	/** @attr */ background: CSS.Property.Background<string> | MoDeL.Styles.Color
	/** @attr */ foreground: CSS.Property.Color | MoDeL.Styles.Color
	/** @attr */ justifyContent: CSS.Property.JustifyContent
	/** @attr */ justifyItems: CSS.Property.JustifyItems
	/** @attr */ justifySelf: CSS.Property.JustifySelf
	/** @attr */ alignContent: CSS.Property.AlignContent
	/** @attr */ alignItems: CSS.Property.AlignItems
	/** @attr */ alignSelf: CSS.Property.AlignSelf
	/** @attr */ userSelect: CSS.Property.UserSelect
}