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
		return this.childElements as Array<DrawerItem>
	}

	protected initialized() {
		this.items.forEach(item => item.selectionChange.subscribe(() => this.open = true))
	}

	render() {
		return html`
			<style>
				:host {
					--drawer-item-depth-padding: 27px;
					--drawer-item-height: 56px;
					position: relative;
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
					height: calc(100% - var(--drawer-item-height) - 7px);
					background: rgba(var(--mo-color-foreground-base), 0.5);
					z-index: -1;
				}

				:host(:not([root])) ::slotted(mo-drawer-item)::before {
					content: ' ';
					position: absolute;
					top: calc(var(--drawer-item-height) / 2);
					width: 15px;
					height: 1px;
					background: rgba(var(--mo-color-foreground-base), 0.5);
					left: 0;
					z-index: -1;
				}
			</style>
			<mo-list @click=${() => this.open = !this.open} ?hidden=${this.root}>
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