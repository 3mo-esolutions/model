import { component, property, PageComponent, DialogComponentConstructor, PageComponentConstructor, DialogComponent, html } from '../library'
import { Drawer, ListItem } from '.'
import { PromiseTask } from '../helpers'

@component('mo-drawer-item')
export default class DrawerItem extends ListItem {
	@property({ type: Object })
	set component(value: PageComponent<any> | DialogComponent<any>) {
		this.componentConstructor = [
			value.constructor,
			(value instanceof PageComponent) ? value['parameters'] : value['parameters']
		]
	}

	private componentConstructor?: [component: PageComponentConstructor<any> | DialogComponentConstructor<any>, parameters: Record<string, string | number | undefined>]

	constructor() {
		super()

		MoDeL.Router.navigated.subscribe(pageConstructor => PromiseTask.delegateToEventLoop(() => this.selected = pageConstructor === this.componentConstructor?.[0]))

		this.onclick = () => {
			if (this.componentConstructor) {
				const component = new this.componentConstructor[0](this.componentConstructor[1])
				if (component instanceof PageComponent) {
					component.navigate()
				} else {
					component.open()
				}
				if (Drawer.type === 'modal') {
					Drawer.isOpen = false
				}
			}
		}
	}

	protected initialized() {
		if (!this.componentConstructor) {
			this.remove()
		}
	}

	protected renderGraphic() {
		return html`
			<span class='mdc-list-item__graphic'>
				<mo-icon icon=${this.icon} opacity='0.75'></mo-icon>
			</span>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-drawer-item': DrawerItem
	}
}