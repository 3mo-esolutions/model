import { Application, application, component, html } from '@3mo/model/library'
import { Drawer } from '@3mo/model/components'
import { PageReader } from './pages'

@application
@component('docs-application')
export class MoDeLDocs extends Application {
	constructor() {
		super()
		Drawer.IsDocked.value = true
	}

	get drawerTemplate() {
		return html`
			<mo-drawer-list>
				<mo-drawer-item icon='insert_emoticon' .component=${new PageReader({ path: '/introduction' })}>Introduction</mo-drawer-item>
				<mo-drawer-list icon='local_library' label='Library'>
					<mo-drawer-item .component=${new PageReader({ path: '/library/components' })}>Components</mo-drawer-item>
					<mo-drawer-item .component=${new PageReader({ path: '/library/component-creation' })}>Component Creation</mo-drawer-item>
					<mo-drawer-item .component=${new PageReader({ path: '/library/element-references' })}>Element References</mo-drawer-item>
					<mo-drawer-item .component=${new PageReader({ path: '/library/properties-attributes' })}>Properties & Attributes</mo-drawer-item>
					<mo-drawer-item .component=${new PageReader({ path: '/library/authentication' })}>Authentication</mo-drawer-item>
					<mo-drawer-item .component=${new PageReader({ path: '/library/PageComponent' })}>Page Components</mo-drawer-item>
					<mo-drawer-item .component=${new PageReader({ path: '/library/DialogComponent' })}>Dialog Components</mo-drawer-item>
					<mo-drawer-item .component=${new PageReader({ path: '/library/event-handling' })}>Event Handling</mo-drawer-item>
					<mo-drawer-item .component=${new PageReader({ path: '/library/debouncer' })}>Function Debouncer</mo-drawer-item>
				</mo-drawer-list>
				<mo-drawer-list icon='category' label='Components'>
					<mo-drawer-item .component=${new PageReader({ path: '/components/DialogAuthenticator' })}>DialogAuthenticator</mo-drawer-item>
				</mo-drawer-list>
				<mo-drawer-item icon='tour' .component=${new PageReader({ path: '/feature-flags' })}>Feature Flags</mo-drawer-item>
				<mo-drawer-item icon='new_releases' .component=${new PageReader({ path: '/versioning' })}>Versioning</mo-drawer-item>
				<mo-drawer-item icon='batch_prediction' .component=${new PageReader({ path: '/project-template' })}>Initiate a MoDeL-Project</mo-drawer-item>
			</mo-drawer-list>
		`
	}
}