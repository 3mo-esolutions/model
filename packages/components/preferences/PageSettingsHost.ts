import { html, css, property, nothing, query, queryAll, TemplateResult, style } from '../../library'
import { NavigationListItem, PageComponent, PageHost } from '../../shell'

export abstract class PageSettingsHost extends PageComponent {
	static override get styles() {
		return css`
			:host {
				--mo-page-settings-host-padding: var(--mo-thickness-xl);
			}

			mo-page-host::part(pageHolder) {
				padding: var(--mo-page-settings-host-padding) var(--mo-page-settings-host-padding) 0px var(--mo-page-settings-host-padding);
				height: calc(100% - var(--mo-page-settings-host-padding));
			}

			--mo-card {
				--mo-card-body-padding: 0px;
			}

			mo-grid {
				grid-template-columns: clamp(200px, 30%, 500px) 1fr;
			}

			#settings {
				padding: var(--mo-page-settings-host-padding);
			}

			#contentToolbar {
				display: none;
				margin-left: -12px;
				padding: var(--mo-page-settings-host-padding);
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
		updated(this: PageSettingsHost) {
			if (this.contentPageHeading) {
				this.isContentOpen = true
			}
		}
	}) contentPageHeading?: string

	@query('mo-page-host') private readonly contentPageHost!: PageHost
	@queryAll('mo-navigation-list-item') private readonly navigationListItems!: Array<NavigationListItem>

	protected override initialized() {
		this.navigationListItems.forEach(item => item.pageHostGetter = () => this.contentPageHost)
	}

	protected override get template() {
		return html`
			<mo-page heading=${this.heading} fullHeight style='--mo-page-margin: 0px'>
				<mo-grid ${style({ height: '100%' })}>
					<mo-flex id='settings'>
						${this.settingsTemplate}
					</mo-flex>
					<mo-flex id='content'>
						${this.contentTemplate}
					</mo-flex>
				</mo-grid>
			</mo-page>
		`
	}

	protected get contentTemplate() {
		return html`
			<mo-flex gap='var(--mo-thickness-m)' ${style({ height: '*' })}>
				${this.contentPageHeading === undefined ? nothing : this.contentToolbarTemplate}
				<mo-page-host ${style({ height: '*' })}
					?hidden=${this.contentPageHeading === undefined}
					@headingChange=${(e: CustomEvent<string>) => this.contentPageHeading = e.detail}
				></mo-page-host>
			</mo-flex>
		`
	}

	private get contentToolbarTemplate() {
		return html`
			<mo-flex id='contentToolbar' gap='var(--mo-thickness-m)' alignItems='center' direction='horizontal'>
				<mo-icon-button icon='arrow_back'
					@click=${() => this.isContentOpen = false}
				></mo-icon-button>
				<mo-heading typography='heading4'>
					${this.contentPageHeading}
				</mo-heading>
			</mo-flex>
		`
	}
}