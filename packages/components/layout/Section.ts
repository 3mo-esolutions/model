import { Component, component, css, html, property } from '../../library'
import { CSSDirection } from '../helpers'
import * as CSS from 'csstype'

/**
 * @slot - Content
 * @slot heading - The heading which has a default template rendering a mo-heading element
 * @slot action - Actions in the header
 */
@component('mo-section')
export class Section extends Component {
	@property() heading = ''
	@property() direction: CSSDirection = 'vertical'
	@property() gap: CSS.Property.Gap<string> = 'unset'
	@property() wrap: CSS.Property.FlexWrap = 'unset'

	static override get styles() {
		return css`
			:host {
				display: block;
			}

			slot[name=action], slot[name=heading], slot[name=heading]::slotted(*) {
				color: var(--mo-accent);
			}
		`
	}

	protected override get template() {
		return html`
			<mo-flex width='100%' height='100%' gap='var(--mo-thickness-l)'>
				<mo-flex minHeight='30px' direction='horizontal' alignItems='center'>
					<slot name='heading'>
						${this.headingTemplate}
					</slot>
					<slot name='action'></slot>
				</mo-flex>

				${this.contentTemplate}
			</mo-flex>
		`
	}

	protected get headingTemplate() {
		return html`
			<mo-heading part='heading' typography='heading4' fontWeight='500'>
				${this.heading}
			</mo-heading>
		`
	}

	protected get contentTemplate() {
		return html`
			<mo-flex height='*' direction=${this.direction} gap=${this.gap} wrap=${this.wrap}>
				<slot></slot>
			</mo-flex>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-section': Section
	}
}