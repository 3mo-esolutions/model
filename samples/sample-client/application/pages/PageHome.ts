import { component, html, PageComponent, homePage, route, state, DialogDefault } from '@3mo/model'

@homePage()
@route('/home')
@component('sample-page-home')
export class PageHome extends PageComponent {
	@state() isLoading = false

	protected override get template() {
		return html`
			<mo-page heading='Home' fullHeight>
				<mo-card>
					<mo-flex height='100%' gap='var(--mo-thickness-xl)'>
						<mo-heading @click=${() => this.isLoading = !this.isLoading}>Loading Button</mo-heading>
						<mo-loading-button ?loading=${this.isLoading} type='raised' @click=${this.save}>Button with sync click handler</mo-loading-button>
						<mo-loading-button type='raised' icon='add' preventClickEventInference @click=${this.asyncAction}>Button with async click handler</mo-loading-button>
						<mo-loading-button type='raised' icon='add' trailingIcon @click=${this.asyncAction}>Button with sync click handler</mo-loading-button>

						<mo-split-button ?loading=${this.isLoading}>
							<mo-loading-button ?loading=${this.isLoading}>Button</mo-loading-button>
						</mo-split-button>

						<mo-field-text label='asdasd'></mo-field-text>
						<mo-text-area label='asdasd'></mo-text-area>

						<mo-tab-bar>
							<mo-tab>A</mo-tab>
							<mo-tab>A</mo-tab>
							<mo-tab>A</mo-tab>
						</mo-tab-bar>
					</mo-flex>
				</mo-card>
			</mo-page>
		`
	}

	private save = async () => {
		console.log(this, 'save')

		await new DialogDefault({
			heading: 'Bestätigung',
			content: html`
				<mo-split-button slot='primaryAction' ?loading=${this.isLoading}>
					<mo-loading-button ?loading=${this.isLoading}>Button</mo-loading-button>
				</mo-split-button>
				<!-- <mo-loading-button slot='primaryAction' type='raised' icon='add' trailingIcon>Primary</mo-loading-button> -->
				Bist du sicher dass ...?
			`,
			primaryButtonText: 'Speichern',
			primaryButtonAction: this.asyncAction,
		}).confirm()
	}

	private async asyncAction() {
		await Promise.sleep(2000)
	}
}