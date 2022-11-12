import { html, css, property, TemplateResult, style } from '@a11d/lit'
import { PageComponent, PageParameters, RouterController } from '@a11d/lit-application'

export abstract class PageSettingsHost<T extends PageParameters> extends PageComponent<T> {
	abstract readonly router: RouterController

	static override get styles() {
		return css`
			lit-page-host *::part(pageHeader) {
				display: none;
			}

			lit-page-host {
				padding: 0 var(--mo-thickness-xl);
			}

			mo-grid {
				grid-template-columns: clamp(200px, 30%, 500px) 1fr;
			}

			#contentToolbar {
				display: none;
				margin-left: -12px;
				padding-bottom: 0px;
			}

			@media (max-width: 900px) {
				mo-grid {
					grid-template-columns: 1fr;
				}

				:host([isContentOpen]) #settings {
					display: none;
				}

				:host(:not([isContentOpen])) #content {
					display: none;
				}

				#contentToolbar {
					display: flex;
				}
			}
		`
	}

	protected abstract get heading(): string

	protected abstract get settingsTemplate(): TemplateResult

	@property({ type: Boolean, reflect: true }) isContentOpen = false

	@property({
		updated(this: PageSettingsHost<any>) {
			if (this.contentPageHeading) {
				this.isContentOpen = true
			}
		}
	}) contentPageHeading?: string

	protected override get template() {
		return html`
			<mo-page heading=${this.heading} fullHeight>
				<mo-grid ${style({ height: '100%' })}>
					<mo-flex id='settings'>${this.settingsTemplate}</mo-flex>
					<mo-flex id='content'>${this.contentTemplate}</mo-flex>
				</mo-grid>
			</mo-page>
		`
	}

	protected get contentTemplate() {
		return html`
			<mo-flex gap='var(--mo-thickness-m)' ${style({ height: '*' })}>
				${this.contentToolbarTemplate}
				<lit-page-host ${style({ height: '*' })} @pageHeadingChange=${(e: CustomEvent<string>) => this.contentPageHeading = e.detail}>
					${this.router.outlet()}
				</lit-page-host>
			</mo-flex>
		`
	}

	private get contentToolbarTemplate() {
		return html`
			<mo-flex id='contentToolbar' gap='var(--mo-thickness-m)' alignItems='center' direction='horizontal'>
				<mo-icon-button icon='arrow_back' @click=${() => new (this.constructor as any)().navigate()}></mo-icon-button>
				<mo-heading typography='heading4'>${this.contentPageHeading}</mo-heading>
			</mo-flex>
		`
	}
}