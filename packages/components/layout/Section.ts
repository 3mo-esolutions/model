import { Component, component, css, html, property } from '../../library'
import { CSSDirection } from '../helpers'
import { IFlex } from './IFlex'
import * as CSS from 'csstype'

@component('mo-section')
export class Section extends Component implements IFlex {
	@property() header = ''
	@property() direction: CSSDirection = 'vertical'
	@property() gap: CSS.Property.Gap<string> = 'unset'
	@property() wrap: CSS.Property.FlexWrap = 'unset'

	static override get styles() {
		return css`
			slot[name=header] {
				display: block;
				flex: 1;
			}
		`
	}

	protected override get template() {
		return html`
			<mo-flex width='100%' height='100%'>
				<mo-flex minHeight='35px' direction='horizontal' alignItems='center'>
					<slot name='header'>
						${this.headlineTemplate}
					</slot>
					<slot name='headerAction'></slot>
				</mo-flex>

				${this.contentTemplate}
			</mo-flex>
		`
	}

	protected get headlineTemplate() {
		return html`
			<mo-headline part='header' typography='headline5' foreground='var(--mo-accent)' style='text-transform: uppercase'>
				${this.header}
			</mo-headline>
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