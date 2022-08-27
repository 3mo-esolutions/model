import { component, homePage, html, state, PageComponent, route } from '@3mo/model'
import { style } from '@a11d/lit'
import { GitHubHelper } from '../helpers'

@homePage()
@route('*path')
@component('doc-page-reader')
export class PageReader extends PageComponent<{ path?: string }> {
	private static readonly defaultPath = '/introduction'

	@state() private docs = ''

	protected override async initialized() {
		this.parameters.path = this.parameters.path ?? PageReader.defaultPath
		this.docs = await GitHubHelper.fetch(`docs${this.parameters.path}.md`)
	}

	protected override get template() {
		return html`
			<mo-page fullHeight>
				<mo-card ${style({ width: '100%', height: '100%', alignItems: 'center', '--mo-card-padding-vertical': 'var(--mo-thickness-xl)' })}>
					<doc-markdown .value=${this.docs}></doc-markdown>
				</mo-card>
			</mo-page>
		`
	}
}