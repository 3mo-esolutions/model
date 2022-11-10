import { Component, property } from '@a11d/lit'
import { Flex } from '../../..'

export abstract class SplitterResizer extends Component {
	@property({ reflect: true }) hostDirection?: Flex['direction']
	@property({ type: Boolean, reflect: true }) hostResizing = false
	@property({ type: Boolean, reflect: true }) hostHover = false
}