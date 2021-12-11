import { component, property, html, ifDefined } from '../../library'
import { PageComponent, DialogComponentConstructor, PageComponentConstructor, DialogComponent } from '..'
import { Drawer, ListItem } from '../../components'

const enum MatchMode {
	All = 'all',
	IgnoreParameters = 'ignore-parameters',
}

@component('mo-drawer-item')
export class DrawerItem extends ListItem {
	@property() matchMode = MatchMode.All

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
		this.checkIfSelected()
		MoDeL.application.pageHost.navigate.subscribe(page => this.checkIfSelected(page.constructor))
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

	private readonly checkIfSelected = (
		constructor: PageComponentConstructor<any> | undefined = MoDeL.application.pageHost.currentPage?.constructor,
		parameters: Record<string, string | number | undefined> = MoDeL.application.pageHost.currentPage?.['parameters']
	) => {
		const arePagesEqual = constructor === this.componentConstructor?.[0]
		const arePageParametersEqual = JSON.stringify(this.componentConstructor?.[1]) === JSON.stringify(parameters)
		Promise.delegateToEventLoop(() => this.selected = arePagesEqual && (arePageParametersEqual || this.matchMode === MatchMode.IgnoreParameters))
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