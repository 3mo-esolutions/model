/* eslint-disable @typescript-eslint/member-ordering */
import { component, property, html, ifDefined } from '../../library'
import { PageComponent, DialogComponentConstructor, PageComponentConstructor, DialogComponent, RouteMatchMode, PageHost } from '..'
import { Drawer, ListItem } from '../../components'

@component('mo-drawer-item')
export class DrawerItem extends ListItem {
	@property() matchMode = RouteMatchMode.All

	@property({
		type: Object,
		observer(this: DrawerItem, value: () => PageHost, oldValue?: () => PageHost) {
			oldValue?.().navigate.unsubscribe(this.handlePageHostNavigation)
			value().navigate.subscribe(this.handlePageHostNavigation)
		}
	}) pageHostGetter = () => MoDeL.application.pageHost

	private readonly handlePageHostNavigation = () => this.checkIfSelected()

	private componentConstructor?: [component: PageComponentConstructor<any> | DialogComponentConstructor<any>, parameters: Record<string, string | number | undefined>]

	@property({ type: Object })
	set component(value: PageComponent<any> | DialogComponent<any>) {
		this.componentConstructor = [
			value.constructor,
			(value instanceof PageComponent) ? value['parameters'] ?? {} : value['parameters'] ?? {}
		]

		const isDialog = value instanceof DialogComponent
		this.switchAttribute('dialog', isDialog)
		if (isDialog) {
			this.nonActivatable = true
		}
	}

	override connected() {
		this.selectionChange.subscribe(isSelected => {
			if (this.componentConstructor && isSelected) {
				const component = new this.componentConstructor[0](this.componentConstructor[1])
				if (component instanceof PageComponent) {
					component.navigate()
				} else {
					component.confirm()
				}
				if (Drawer.type === 'modal') {
					Drawer.open = false
				}
			}
		})
	}

	private readonly checkIfSelected = () => {
		const pageOrDialog = this.componentConstructor?.[0] ? new this.componentConstructor[0](this.componentConstructor[1]) : undefined!
		const pageHost = this.pageHostGetter()
		const isSelected = pageOrDialog instanceof PageComponent
			? pageHost.currentPage ? MoDeL.Router.arePagesEqual(pageOrDialog, pageHost.currentPage) : false
			: pageOrDialog.constructor === this.componentConstructor?.[0]
		this.selected = isSelected
	}

	protected override renderGraphic = () => html`
		<span class='mdc-deprecated-list-item__graphic'>
			<mo-icon icon=${ifDefined(this.icon)} opacity='0.75'></mo-icon>
		</span>
	`
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-drawer-item': DrawerItem
	}
}