import { component, html, PageComponent, homePage, route, state } from '@3mo/model'
import { countries } from './countries'

@homePage()
@route('/home')
@component('sample-page-home')
export class PageHome extends PageComponent {
	protected override get template() {
		return html`
			<mo-page heading='Home' fullHeight>
				<mo-flex height='100%' alignItems='center' justifyContent='center' gap='var(--mo-thickness-xl)'>
					${this.buttonGroupTemplate}
				</mo-flex>
			</mo-page>
		`
	}

	protected get buttonGroupTemplate() {
		return html`
			<mo-button-group type='outlined' direction='horizontal'>
				<mo-button>B</mo-button>
				<mo-button>I</mo-button>
				<mo-button>U</mo-button>
			</mo-button-group>
		`
	}

	protected get splitButtonsTemplate() {
		return html`
			<mo-split-button>
				<mo-button type='raised' icon='save'>Speichern</mo-button>
				<mo-list-item slot='more'>Zwischenspeichern</mo-list-item>
				<mo-list-item slot='more'>Als Kopie speichern</mo-list-item>
			</mo-split-button>

			<mo-split-button>
				<mo-button type='raised' icon='merge_type'>Merge</mo-button>
				<mo-list-item slot='more'>Squash & Merge</mo-list-item>
				<mo-list-item slot='more'>Rebase & Merge</mo-list-item>
			</mo-split-button>
		`
	}

	protected get fieldSelectTemplate() {
		return html`
			<mo-card>
				<mo-field-select label='Länder' searchable>
					${countries.map(country => html`
						<mo-option value=${country.code}>${country.label}</mo-option>
					`)}
				</mo-field-select>
			</mo-card>
		`
	}

	@state() fetchableSelectParameters = {}
	protected get fieldFetchableSelectTemplate() {
		return html`
			<mo-card>
				<mo-field-fetchable-select label='Länder' searchable
					.fetch=${this.fetch}
					.parameters=${this.fetchableSelectParameters as any}
					.optionTemplate=${(country: any) => html`<mo-option value=${country.code}>${country.label}</mo-option>` as any}
					.searchParameters=${(keyword: string) => ({ keyword: keyword })}
				></mo-field-fetchable-select>
			</mo-card>
		`
	}

	private readonly fetch = async (parameters?: { keyword?: string }) => {
		console.log('fetching data will take 200ms ...', parameters?.keyword)
		await Promise.sleep(200)
		const keyword = parameters?.keyword
		return Promise.resolve(!keyword ? countries : countries.filter(country => country.label.toLowerCase().includes(keyword.toLowerCase())))
	}
}