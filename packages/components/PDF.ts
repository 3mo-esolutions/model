import { component, html, Component, nothing, property, css, style } from '@a11d/lit'
import { ClientInfoHelper } from '../utilities'

@component('mo-pdf')
export class PDF extends Component {
	@property() source?: string

	@property({ type: Boolean, reflect: true }) protected loading = this.supportsLoading

	static override get styles() {
		return css`
			:host([loading]) embed {
				visibility: hidden;
			}

			embed, iframe {
				flex: 1;
			}

			mo-circular-progress {
				position: absolute;
				margin: auto;
				inset: 0;
			}
		`
	}

	private get supportsLoading() {
		return ClientInfoHelper.operatingSystem !== 'macOS' || ClientInfoHelper.browser !== 'Safari'
	}

	private get supportsEmbed() {
		return ClientInfoHelper.operatingSystem !== 'macOS' || ClientInfoHelper.browser !== 'Safari'
	}

	protected get pdfSource() {
		return this.source
	}

	protected override get template() {
		return !this.pdfSource ? nothing : html`
			<mo-flex ${style({ height: '100%', width: '100%' })}>
				${this.loading ? html`<mo-circular-progress indeterminate></mo-circular-progress>` : nothing}
				${this.supportsEmbed ? html`
					<embed type='application/pdf' src=${this.pdfSource} @load=${() => this.loading = false} />
				` : html`
					<iframe type='application/pdf' src=${this.pdfSource} @load=${() => this.loading = false}></iframe>
				`}
			</mo-flex>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-pdf': PDF
	}
}