import { component, html } from '..'
import { HttpError } from '../../types'
import { PageComponent } from '.'

@component('mdc-page-error')
export class PageError extends PageComponent<{ error: HttpError }> {
	private get error() {
		return this.parameters.error
	}

	private errors = new Map<HttpError, { emoji: string, message: string }>([
		['404', { emoji: '🧐', message: 'Page Not Found' }],
		['403', { emoji: '🔒', message: 'Access Denied' }],
	])

	protected render() {
		return html`
			<style>
				h1 {
					font-size: 60px;
					text-align: center;
					margin: 0 0 20px 0;
					font-weight: 400;
				}

				span {
					color: var(--mdc-theme-primary);
				}

				h2 {
					font-size: xx-large;
					text-align: center;
					margin: 0;
					font-weight: 400;
				}

				h3 {
					font-size: x-large;
					text-align: center;
					margin: 0;
					font-weight: 400;
				}
			</style>

			<mdc-page title='Error' fullHeight>
				<mdc-flex alignItems='center' justifyContent='center' height='100%' width='100%'>
					<mdc-div>
						<h1>
							<span>${this.error.charAt(0)}</span>${this.errors.get(this.error)?.emoji}<span>${this.error.charAt(2)}</span>
						</h1>
					</mdc-div>
					<mdc-div>
						<h2>${this.errors.get(this.error)?.message}</h2>
						<h3>Open the menu and navigate to a page</h3>
					</mdc-div>
				</mdc-flex>
			</mdc-page>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mdc-page-error': PageError
	}
}