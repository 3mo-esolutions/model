import { Component, property } from '../../../../library'
import { CSSDirection } from '../../..'

export abstract class SplitterResizer extends Component {
	@property({ reflect: true }) hostDirection?: CSSDirection
	@property({ type: Boolean, reflect: true }) hostResizing = false
	@property({ type: Boolean, reflect: true }) hostHover = false
}