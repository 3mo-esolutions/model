import { DrawerItem } from '.'
import { Component, component, html, property } from '../library'
import { MaterialIcon } from '../types'

@component('mo-drawer-list')
export default class DrawerList extends Component {
	constructor() {
		super()
		this.root = this.parentElement === null
		this.open = !!this.root
	}

	@property({ type: Boolean, reflect: true }) root = false
	@property({ type: Boolean, reflect: true }) open = false
	@property() icon!: MaterialIcon
	@property() label = ''

	private get items() {
		return this.childElements as Array<DrawerItem | DrawerList>
	}

	protected initialized() {
		for (const item of this.items) {
			if (item instanceof DrawerItem) {
				item.selectionChange.subscribe(() => this.open = true)
			}
		}
	}

	render() {
		return html`
			<style>
				:host {
					--drawer-item-depth-padding: 18px;
					--drawer-item-height: 40px;
					--drawer-item-vertical-margin: 4px;
					--drawer-list-side-margin: 6px;
					position: relative;
				}

				:host([root]) {
					margin: 0 var(--drawer-list-side-margin);
				}

				:host([open]) {
					display: block;
				}

				:host(:not([root])) mo-list[activatable] {
					margin-left: var(--drawer-item-depth-padding);
				}

				:host(:not([open])) mo-list[activatable] {
					display: none;
				}

				:host(:not([root])) mo-list[activatable]::before {
					content: ' ';
					position: absolute;
					top: calc(var(--drawer-item-height) / 2);
					width: 1px;
					height: calc(100% - var(--drawer-item-height));
					background: rgba(var(--mo-color-foreground-base), 0.5);
					z-index: -1;
				}

				:host(:not([root])) ::slotted(mo-drawer-item)::before {
					content: ' ';
					position: absolute;
					top: calc(var(--drawer-item-height) / 2);
					width: 10px;
					height: 1px;
					background: rgba(var(--mo-color-foreground-base), 0.5);
					left: 0;
					z-index: -1;
				}

				mo-list-item, mo-drawer-item, ::slotted(mo-drawer-item) {
					margin-bottom: var(--drawer-item-vertical-margin);
					margin-top: var(--drawer-item-vertical-margin);
					border-radius: var(--mo-border-radius);
					height: var(--drawer-item-height);
					--mdc-list-side-padding: 6px;
				}

				mo-list, mo-drawer-list, ::slotted(mo-drawer-list) {
					--mdc-list-vertical-padding: 0px;
					--mdc-typography-subtitle1-font-size: var(--mo-font-size-m);
				}
			</style>
			<mo-list height='var(--drawer-item-height)' @click=${() => this.open = !this.open} ?hidden=${this.root}>
				<mo-list-item icon=${this.icon} metaIcon=${this.open ? 'arrow_drop_up' : 'arrow_drop_down'}>
					${this.label}
				</mo-list-item>
			</mo-list>
			<mo-list activatable>
				<slot></slot>
			</mo-list>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-drawer-list': DrawerList
	}
}