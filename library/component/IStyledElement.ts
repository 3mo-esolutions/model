/* eslint-disable */
import * as CSS from 'csstype'

// TODO include variable names

export interface IStyledElement {
	/** @attr */ display: CSS.Property.Display
	/** @attr */ hidden: boolean
	/** @attr */ position: CSS.Property.Position
	/** @attr */ margin: CSS.Property.Margin<string>
	/** @attr */ padding: CSS.Property.Padding<string>
	/** @attr */ cursor: CSS.Property.Cursor
	/** @attr */ width: CSS.Property.Width<string>
	/** @attr */ minWidth: CSS.Property.MinWidth<string>
	/** @attr */ maxWidth: CSS.Property.MaxWidth<string>
	/** @attr */ height: CSS.Property.Height<string>
	/** @attr */ minHeight: CSS.Property.MinHeight<string>
	/** @attr */ maxHeight: CSS.Property.MaxHeight<string>
	/** @attr */ fontSize: CSS.Property.FontSize
	/** @attr */ lineHeight: CSS.Property.LineHeight
	/** @attr */ flexGrow: CSS.Property.FlexGrow | (string | {})
	/** @attr */ flexBasis: CSS.Property.FlexBasis<string>
	/** @attr */ gridRow: CSS.Property.GridRow
	/** @attr */ gridColumn: CSS.Property.GridColumn
	/** @attr */ textAlign: CSS.Property.TextAlign
	/** @attr */ borderRadius: CSS.Property.BorderRadius<string>
	/** @attr */ background: CSS.Property.Background<string>
	/** @attr */ foreground: CSS.Property.Color
	/** @attr */ justifyContent: CSS.Property.JustifyContent
	/** @attr */ justifyItems: CSS.Property.JustifyItems
	/** @attr */ justifySelf: CSS.Property.JustifySelf
	/** @attr */ alignContent: CSS.Property.AlignContent
	/** @attr */ alignItems: CSS.Property.AlignItems
	/** @attr */ alignSelf: CSS.Property.AlignSelf
	/** @attr */ userSelect: CSS.Property.UserSelect
}