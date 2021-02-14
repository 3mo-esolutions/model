import { component, property, PageComponent, DialogComponentConstructor, PageComponentConstructor, DialogComponent, html, PageHost, ifDefined } from '../library'
import { Drawer, ListItem } from '.'

@component('mo-drawer-item')
export class DrawerItem extends ListItem {
	@property({ type: Object })
	set component(value: PageComponent<any> | DialogComponent<any>) {
		this.componentConstructor = [
			value.constructor,
			(value instanceof PageComponent) ? value['parameters'] ?? {} : value['parameters'] ?? {}
		]
	}

	private componentConstructor?: [component: PageComponentConstructor<any> | DialogComponentConstructor<any>, parameters: Record<string, string | number | undefined>]

	constructor() {
		super()

		MoDeL.Router.navigated.subscribe(pageConstructor => {
			const arePagesEqual = pageConstructor === this.componentConstructor?.[0]
			const arePageParametersEqual = JSON.stringify(this.componentConstructor?.[1]) === JSON.stringify(PageHost.currentPage['parameters'])
			PromiseTask.delegateToEventLoop(() => this.selected = arePagesEqual && arePageParametersEqual)
		})

		this.selectionChange.subscribe(() => {
			if (!this.componentConstructor) {
				this.selected = false
			}
		})

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

	protected renderGraphic = () => html`
		<span class='mdc-list-item__graphic'>
			<mo-icon icon=${ifDefined(this.icon)} opacity='0.75'></mo-icon>
		</span>
	`
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-drawer-item': DrawerItem
	}
}