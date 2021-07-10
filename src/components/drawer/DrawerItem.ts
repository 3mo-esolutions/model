import { component, property, PageComponent, DialogComponentConstructor, PageComponentConstructor, DialogComponent, html, PageHost, ifDefined, css } from '../../library'
import { Drawer, ListItem } from '..'

const enum MatchMode {
	All = 'all',
	IgnoreParameters = 'ignore-parameters',
}

@component('mo-drawer-item')
export class DrawerItem extends ListItem {
	static get styles() {
		return [
			super.styles,
			css`
				:host([disabled][interactive]) {
					cursor: pointer;
					pointer-events: auto;
				}
			`
		] as any
	}

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
			this.disabled = true
			this.switchAttribute('interactive', true)
		}
	}

	constructor() {
		super()

		MoDeL.Router.navigated.subscribe(pageConstructor => {
			const arePagesEqual = pageConstructor === this.componentConstructor?.[0]
			const arePageParametersEqual = JSON.stringify(this.componentConstructor?.[1]) === JSON.stringify(PageHost.currentPage?.['parameters'])
			PromiseTask.delegateToEventLoop(() => this.selected = arePagesEqual && (arePageParametersEqual || this.matchMode === MatchMode.IgnoreParameters))
		})

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