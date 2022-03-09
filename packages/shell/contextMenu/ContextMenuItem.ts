import { component, css, property, html, PropertyValues, event, query } from '../../library'
import { Flex, ListItem, Menu } from '../../components'
import { ContextMenu } from '..'

/**
 * @slot details
 * @fires openChange {CustomEvent<boolean>}
 */
@component('mo-context-menu-item')
export class ContextMenuItem extends ListItem {
	@event() readonly openChange!: EventDispatcher<boolean>

	@property({
		type: Boolean,
		reflect: true,
		updated(this: ContextMenuItem) {
			if (!this.detailsMenu || !(this.detailsMenu.mdcRoot as null | Element)) {
				return
			}
			this.detailsMenu.requestUpdate()

			const selfBoundingRect = this.getBoundingClientRect()
			const listBoundingRect = this.detailsMenu.mdcRoot.mdcRoot.getBoundingClientRect()

			this.flexDetails.style.width = `${listBoundingRect.width}px`
			this.flexDetails.style.height = `${listBoundingRect.height}px`

			const flexBoundingRect = this.flexDetails.getBoundingClientRect()

			const totalRightDistance = document.documentElement.scrollWidth - selfBoundingRect.right
			const totalLeftDistance = selfBoundingRect.left
			const shallBeAttachedLeft = flexBoundingRect.width > totalRightDistance && totalLeftDistance > totalRightDistance
			this.flexDetails.left = shallBeAttachedLeft ? '' : '100%'
			this.flexDetails.right = shallBeAttachedLeft ? '100%' : ''

			const totalBottomDistance = document.documentElement.scrollHeight - selfBoundingRect.bottom
			const totalTopDistance = selfBoundingRect.top
			const shallBeOpenedTop = flexBoundingRect.height > totalBottomDistance && totalTopDistance > totalBottomDistance
			this.flexDetails.top = shallBeOpenedTop ? '' : '0px'
			this.flexDetails.bottom = shallBeOpenedTop ? '0px' : ''
		}
	}) open = false

	@query('mo-flex') private readonly flexDetails!: Flex

	static override get styles() {
		return [
			...super.styles,
			css`
				:host {
					overflow: unset !important;
				}

				:host([disabled]) {
					color: var(--mo-color-gray);
				}

				:host([open]) {
					background-color: rgba(var(--mo-color-gray-base), 0.1);
				}

				:host(:not([open])) ::slotted(mo-context-menu[slot=details]) {
					display: none;
				}
			`
		]
	}

	protected override initialized() {
		this.initializeDetailsMenuIfExists()
		this.syncOpenAndMouseOver()
		this.overrideClickBehavior()
	}

	private initializeDetailsMenuIfExists() {
		if (!this.detailsMenu) {
			return
		}
		this.detailsMenu.absolute = true
		this.detailsMenu.open = true
		this.detailsMenu.anchor = document.body
	}

	private syncOpenAndMouseOver() {
		this.addEventListener('mouseover', () => {
			this.contextMenu.items
				.filter(item => item !== this && item instanceof ContextMenuItem)
				.forEach(item => (item as ContextMenuItem).open = false)

			if (!this.detailsMenu) {
				return
			}

			this.open = true
			this.openChange.dispatch(true)
		})
	}

	private overrideClickBehavior() {
		Promise.delegateToEventLoop(() => {
			if (this.detailsMenu) {
				const voidHandler = () => void 0
				this['onClick'] = voidHandler
				// this.contextMenu.mdcRoot.close = voidHandler
				this.detailsMenu.mdcRoot.close = voidHandler
			}
		})
	}

	override render() {
		return html`
			${super.render()}
			<mo-flex position='absolute'>
				<slot name='details'></slot>
			</mo-flex>
		`
	}

	protected override updated(props: PropertyValues) {
		super.updated(props)
		this.metaIcon = this.detailsMenu ? 'arrow_right' : undefined
	}

	private get contextMenu() {
		return this.parentElement as ContextMenu
	}

	private get detailsMenu() {
		return this.querySelector<Menu>('mo-context-menu[slot=details]')
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-context-menu-item': ContextMenuItem
	}
}