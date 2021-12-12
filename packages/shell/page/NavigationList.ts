import { Component, component, html, property, ifDefined, css } from '../../library'
import { MaterialIcon, NavigationListItem } from '../..'

@component('mo-navigation-list')
export class NavigationList extends Component {
	@property({ type: Boolean, reflect: true }) root = false
	@property({ type: Boolean, reflect: true }) open = false
	@property() icon?: MaterialIcon
	@property() label = ''

	private get items() {
		return Array.from(this.children) as Array<NavigationListItem | NavigationList>
	}

	protected override initialized() {
		this.items
			.filter((item): item is NavigationListItem => item instanceof NavigationListItem)
			.forEach(item => item.selectionChange.subscribe(() => this.open = true))
	}

	static override get styles() {
		return css`
			:host {
				--drawer-item-depth-padding: 18px;
				--drawer-item-height: 40px;
				--drawer-item-vertical-margin: 4px;
				position: relative;
				display: block;
			}

			:host(:not([open])) mo-list[activatable] {
				display: none;
			}

			:host(:not([root])) mo-list[activatable] {
				margin-left: var(--drawer-item-depth-padding);
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

			:host(:not([root])) ::slotted([mwc-list-item])::before, :host(:not([root])) ::slotted(mo-navigation-list)::before {
				content: ' ';
				position: absolute;
				top: calc(var(--drawer-item-height) / 2);
				width: calc(var(--drawer-item-height) / 2);
				height: 1px;
				background: rgba(var(--mo-color-foreground-base), 0.5);
				left: 0;
				z-index: -1;
			}

			[mwc-list-item], ::slotted([mwc-list-item]) {
				margin-bottom: var(--drawer-item-vertical-margin);
				margin-top: var(--drawer-item-vertical-margin);
				border-radius: var(--mo-border-radius);
				height: var(--drawer-item-height);
				--mdc-list-side-padding: 6px;
			}

			:host(:not([root])) [mwc-list-item], :host(:not([root])) ::slotted([mwc-list-item]) {
				padding-left: calc(var(--drawer-item-depth-padding) * 1.5);
			}

			:host([icon]:not([root])) [mwc-list-item], :host(:not([root])) [mwc-list-item][icon], :host(:not([root])) ::slotted([mwc-list-item][icon]) {
				padding-left: calc(var(--drawer-item-depth-padding) * 1.5 - 20px);
			}

			mo-list, mo-navigation-list, ::slotted(mo-navigation-list) {
				--mdc-list-vertical-padding: 0px;
				--mdc-typography-subtitle1-font-size: var(--mo-font-size-m);
			}
		`
	}

	protected override get template() {
		return html`
			<mo-list height='var(--drawer-item-height)' @click=${() => this.open = !this.open} ?hidden=${this.root}>
				<mo-list-item icon=${ifDefined(this.icon)} metaIcon=${this.open ? 'arrow_drop_up' : 'arrow_drop_down'}>
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
		'mo-navigation-list': NavigationList
	}
}