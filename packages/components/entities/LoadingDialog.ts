import { component, css, html, property, nothing } from '@a11d/lit'
import { Dialog } from '@3mo/dialog'
import { Localizer } from '@3mo/localization'

Localizer.register(LanguageCode.German, {
	'Loading ...': 'Lädt ...',
})

/**
 * @element mo-loading-dialog
 *
 * @attr loading
 * @attr loadingHeading
 */
@component('mo-loading-dialog')
export class LoadingDialog extends Dialog {
	@property({ type: Boolean }) loading = false
	@property({ type: String }) loadingHeading = t('Loading ...')

	protected get isLoading() {
		return this.loading
	}

	protected override get dialogHeading() {
		return this.isLoading ? this.loadingHeading : super.dialogHeading
	}

	static override get styles() {
		return css`
			${super.styles}

			slot[name=loading] {
				inset: 50px 0 0 0;
				backdrop-filter: blur(5px);
				position: absolute;
				display: block;
				z-index: 1;
				background: rgba(var(--mo-color-surface-base),0.5);
			}

			mo-circular-progress {
				position: absolute;
				margin: auto;
				inset: 0;
			}
		`
	}

	protected override get contentSlotTemplate() {
		this.switchAttribute('isLoading', this.isLoading)
		return html`
			${super.contentSlotTemplate}
			${this.loadingTemplate}
		`
	}

	protected get loadingTemplate() {
		return !this.isLoading ? nothing : html`
			<slot name='loading'>
				<mo-circular-progress></mo-circular-progress>
			</slot>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-loading-dialog': LoadingDialog
	}
}