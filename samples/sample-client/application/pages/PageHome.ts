import { component, html, PageComponent, homePage, route, NotificationHost } from '@3mo/model'
import { DialogSample } from './DialogSample'

@homePage()
@route('/home')
@component('sample-page-home')
export class PageHome extends PageComponent {
	protected override get template() {
		return html`
			<mo-page heading='Home' fullHeight>
				<mo-card>
					<mo-flex height='100%' alignItems='center' justifyContent='center' gap='var(--mo-thickness-xl)'>
						<mo-heading foreground='var(--mo-accent)'>Welcome to 3MO Design Library</mo-heading>
						<mo-div>As always there is a counter in a sample project. Get used to it 😀</mo-div>
						<mo-button @click=${() => new DialogSample().confirm()}>Open Dialog</mo-button>
						<mo-field-select>
							<mo-option>A</mo-option>
							<mo-option>B</mo-option>
							<mo-option>C</mo-option>
							<mo-option>D</mo-option>
						</mo-field-select>
						<sample-counter
							count='1'
							@countChange=${this.handleCountChange}
						></sample-counter>
					</mo-flex>
				</mo-card>
			</mo-page>
		`
	}

	private readonly handleCountChange = async (e: CustomEvent<number>) => {
		await NotificationHost.instance.notifyInfo(`countChange event intercepted with the value: ${e.detail}`)
	}
}