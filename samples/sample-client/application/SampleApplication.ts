import { Application, application, component, html } from '@3mo/model/library'
import { PageHome } from './pages'

@application
@component('sample-app')
export class Sample extends Application {
	get drawerTemplate() {
		return html`
			<mo-drawer-list>
				<mo-drawer-item icon='home' .component=${new PageHome()}>Home</mo-drawer-item>
			</mo-drawer-list>
		`
	}
}