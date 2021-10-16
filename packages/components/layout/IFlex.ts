import { CSSDirection } from '..'
import * as CSS from 'csstype'

export interface IFlex {
	direction: CSSDirection
	wrap: CSS.Property.FlexWrap
	gap: CSS.Property.Gap<string>
}