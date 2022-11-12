import { Component, component, css, html, ifDefined, nothing, property, query, state } from '@a11d/lit'
import { SlotController } from '@3mo/slot-controller'
import type { MaterialIcon } from '@3mo/icon'

@component('mo-navigation-list-item')
export class NavigationListItem extends Component {
	@property() label?: string
	@property() icon?: MaterialIcon

	@state() private open = false

	static override get styles() {
		return css`
			mo-list-item {
				height: var(--mo-navigation-list-item-height, 45px);
			}

			:host([data-router-selected]) mo-list-item {
				color: var(--mo-color-accent);
				--mdc-ripple-color: var(--mo-color-accent);
				background: var(--mo-color-accent-gradient-transparent);
			}

			summary {
				list-style: none;
			}

			slot[name=details] {
				display: block;
			}

			mo-list-item::part(content) {
				width: 100%;
				padding-left: calc(var(--mo-navigation-list-item-level, 0) * 35px);
			}

			mo-flex {
				width: 100%;
				justify-content: space-between;
			}
		`
	}

	private readonly slotController = new SlotController(this)

	@query('details') private readonly detailsElement?: HTMLDetailsElement

	private get hasDetails() {
		return this.slotController.hasAssignedElements('details')
	}

	protected override get template() {
		return !this.hasDetails ? this.listItemTemplate : html`
			<details ?open=${this.open} @toggle=${() => this.open = this.detailsElement?.open ?? false}>
				<summary tabindex='-1'>${this.listItemTemplate}</summary>
				<slot name='details'></slot>
			</details>
		`
	}

	private get listItemTemplate() {
		return html`
			<mo-list-item tabindex='0' icon=${ifDefined(this.icon)}>
				<mo-flex direction='horizontal'>
					${this.label}
					<slot @slotchange=${this.handleSlotChange}></slot>
					${!this.hasDetails ? nothing : html`
						<mo-icon icon=${!this.open ? 'arrow_drop_down' : 'arrow_drop_up'}></mo-icon>
					`}
				</mo-flex>
			</mo-list-item>
		`
	}

	private handleSlotChange = () => {
		const currentLevel = Number(this.style.getPropertyValue('--mo-navigation-list-item-level') ?? '0')
		for (const element of this.slotController.getAssignedElements('')) {
			if (element instanceof NavigationListItem) {
				element.slot = 'details'
				element.style.setProperty('--mo-navigation-list-item-level', `${currentLevel + 1}`)
			}
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-navigation-list-item': NavigationListItem
	}
}