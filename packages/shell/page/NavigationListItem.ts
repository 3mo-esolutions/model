/* eslint-disable @typescript-eslint/member-ordering */
import { component, property, html, ifDefined } from '../../library'
import { PageComponent, DialogComponentConstructor, PageComponentConstructor, DialogComponent, RouteMatchMode, PageHost } from '..'
import { Drawer, ListItem } from '../../components'

@component('mo-navigation-list-item')
export class NavigationListItem extends ListItem {
	@property() matchMode = RouteMatchMode.All

	@property({
		type: Object,
		observer(this: NavigationListItem, value: () => PageHost, oldValue?: () => PageHost) {
			oldValue?.().navigate.unsubscribe(this.handlePageHostNavigation)
			value().navigate.subscribe(this.handlePageHostNavigation)
		}
	}) pageHostGetter = () => MoDeL.application.pageHost

	private readonly handlePageHostNavigation = () => {
		const pageOrDialog = this.componentConstructor?.[0] ? new this.componentConstructor[0](this.componentConstructor[1]) : undefined!
		const pageHost = this.pageHostGetter()
		const isSelected = pageOrDialog instanceof PageComponent
			? pageHost.currentPage ? MoDeL.Router.arePagesEqual(pageOrDialog, pageHost.currentPage) : false
			: pageOrDialog.constructor === this.componentConstructor?.[0]
		this.selected = isSelected
	}

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

	protected override initialized() {
		this.selectionChange.subscribe(isSelected => {
			if (!this.componentConstructor) {
				return
			}
			const component = new this.componentConstructor[0](this.componentConstructor[1])
			if (component instanceof DialogComponent) {
				// Dialog shall be confirmed even is isSelected is reported as false
				component.confirm()
			} else {
				if (isSelected === false) {
					return
				}
				component.navigate()
			}
			if (Drawer.type === 'modal') {
				Drawer.open = false
			}
		})
	}

	protected override renderGraphic = () => html`
		<span class='mdc-deprecated-list-item__graphic'>
			<mo-icon icon=${ifDefined(this.icon)} opacity='0.75'></mo-icon>
		</span>
	`
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-navigation-list-item': NavigationListItem
	}
}