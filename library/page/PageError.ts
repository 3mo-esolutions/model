import { component, html } from '..'
import { HttpError } from '../../types'
import { PageComponent } from '.'

@component('mo-page-error')
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
					color: var(--mo-accent);
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

			<mo-page title='Error' fullHeight>
				<mo-flex alignItems='center' justifyContent='center' height='100%' width='100%'>
					<mo-div>
						<h1>
							<span>${this.error.charAt(0)}</span>${this.errors.get(this.error)?.emoji}<span>${this.error.charAt(2)}</span>
						</h1>
					</mo-div>
					<mo-div>
						<h2>${this.errors.get(this.error)?.message}</h2>
						<h3>Open the menu and navigate to a page</h3>
					</mo-div>
				</mo-flex>
			</mo-page>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-page-error': PageError
	}
}