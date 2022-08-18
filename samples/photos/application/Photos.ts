import { Application, application, component, html } from '@3mo/model'
import { PageHome } from './pages'

@application()
@component('photos-app')
export class Photos extends Application {
	override get drawerTemplate() {
		return html`
			<mo-navigation-list-item icon='home' .component=${new PageHome({})}>Home</mo-navigation-list-item>
		`
	}
}