import { DrawerItem } from '.'
import { Component, component, html, property } from '../library'
import { MaterialIcon } from '../types'

@component('mdc-drawer-list')
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
		this.items.forEach(item => item.select?.subscribe(() => this.open = true))
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

				:host(:not([root])) mdc-list[activatable] {
					margin-left: var(--drawer-item-depth-padding);
				}

				:host(:not([open])) mdc-list[activatable] {
					display: none;
				}

				:host(:not([root])) mdc-list[activatable]::before {
					content: ' ';
					position: absolute;
					top: calc(var(--drawer-item-height) / 2);
					width: 1px;
					height: calc(100% - var(--drawer-item-height) - 7px);
					background: rgba(var(--mdc-color-foreground-base), 0.5);
					z-index: -1;
				}

				:host(:not([root])) ::slotted(mdc-drawer-item)::before {
					content: ' ';
					position: absolute;
					top: calc(var(--drawer-item-height) / 2);
					width: 15px;
					height: 1px;
					background: rgba(var(--mdc-color-foreground-base), 0.5);
					left: 0;
					z-index: -1;
				}
			</style>
			<mdc-list @click=${() => this.open = !this.open} ?hidden=${this.root}>
				<mdc-list-item icon=${this.icon} metaIcon=${this.open ? 'arrow_drop_up' : 'arrow_drop_down'}>
					${this.label}
				</mdc-list-item>
			</mdc-list>
			<mdc-list activatable>
				<slot></slot>
			</mdc-list>
		`
	}
}