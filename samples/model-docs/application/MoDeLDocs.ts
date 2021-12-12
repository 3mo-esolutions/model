import { Application, application, component, html, Drawer, Logo } from '@3mo/model'
import { PageReader } from './pages'

@application
@component('docs-application')
export class MoDeLDocs extends Application {
	constructor() {
		super()
		Logo.source = '/assets/3mo.svg'
		Drawer.isDocked.value = true
	}

	get drawerTemplate() {
		return html`
			<mo-navigation-list-item icon='insert_emoticon' .component=${new PageReader({ path: '/introduction' })}>Introduction</mo-navigation-list-item>
			<mo-navigation-list icon='local_library' label='Library'>
				<mo-navigation-list-item .component=${new PageReader({ path: '/library/components' })}>Components</mo-navigation-list-item>
				<mo-navigation-list-item .component=${new PageReader({ path: '/library/component-creation' })}>Component Creation</mo-navigation-list-item>
				<mo-navigation-list-item .component=${new PageReader({ path: '/library/element-references' })}>Element References</mo-navigation-list-item>
				<mo-navigation-list-item .component=${new PageReader({ path: '/library/properties-attributes' })}>Properties & Attributes</mo-navigation-list-item>
				<mo-navigation-list-item .component=${new PageReader({ path: '/library/authentication' })}>Authentication</mo-navigation-list-item>
				<mo-navigation-list-item .component=${new PageReader({ path: '/library/PageComponent' })}>Page Components</mo-navigation-list-item>
				<mo-navigation-list-item .component=${new PageReader({ path: '/library/DialogComponent' })}>Dialog Components</mo-navigation-list-item>
				<mo-navigation-list-item .component=${new PageReader({ path: '/library/event-handling' })}>Event Handling</mo-navigation-list-item>
			</mo-navigation-list>
			<mo-navigation-list icon='category' label='Components'>
				<mo-navigation-list-item .component=${new PageReader({ path: '/components/DialogAuthenticator' })}>DialogAuthenticator</mo-navigation-list-item>
			</mo-navigation-list>
			<mo-navigation-list-item icon='tour' .component=${new PageReader({ path: '/feature-flags' })}>Feature Flags</mo-navigation-list-item>
			<mo-navigation-list-item icon='new_releases' .component=${new PageReader({ path: '/versioning' })}>Versioning</mo-navigation-list-item>
			<mo-navigation-list-item icon='batch_prediction' .component=${new PageReader({ path: '/project-template' })}>Initiate a MoDeL-Project</mo-navigation-list-item>
		`
	}
}