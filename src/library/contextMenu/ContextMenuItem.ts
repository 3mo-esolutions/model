import { query } from 'lit-element'
import { component, css, property, html, PropertyValues, event } from '..'
import { Flex, ListItem, Menu } from '../../components'

/**
 * @slot details
 * @fires openChange {CustomEvent<boolean>}
 */
@component('mo-context-menu-item')
export class ContextMenuItem extends ListItem {
	@event() readonly openChange!: IEvent<boolean>

	@property({
		type: Boolean,
		reflect: true,
		observer(this: ContextMenuItem) {
			const selfBoundingRect = this.getBoundingClientRect()
			const listBoundingRect = this.detailsMenu?.mdcRoot.mdcRoot.getBoundingClientRect()
			this.flexDetails.style.width = `${listBoundingRect?.width ?? 0}px`
			this.flexDetails.style.height = `${listBoundingRect?.height ?? 0}px`
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

				:host([open]), :host(:hover) {
					background-color: rgba(var(--mo-color-gray-base), 0.1);
				}

				:host(:not([open])) ::slotted(mo-context-menu[slot=details]) {
					visibility: hidden;
				}
			`
		]
	}

	protected initialized() {
		this.initializeDetailsMenuIfExists()
		this.configureMouseBehavior()
		this.overrideClickBehavior()
	}

	private overrideClickBehavior() {
		const hasDetailsMenu = !!this.detailsMenu
		// TODO: MD-171: prevent close on click if hasDetailsMenu
	}

	private configureMouseBehavior() {
		this.addEventListener('mouseover', () => this.detailsMenuOpen = true)
		this.otherContextMenuItems.forEach(item => item.addEventListener('mouseover', () => this.detailsMenuOpen = false))
	}

	private get otherContextMenuItems() {
		return Array.from(this.parentElement?.querySelectorAll('mo-context-menu-item') ?? []).filter(item => item !== this)
	}

	render() {
		return html`
			${super.render()}
			<mo-flex position='absolute' left='100%' top='0px'>
				<slot name='details'></slot>
			</mo-flex>
		`
	}

	protected override updated(props: PropertyValues) {
		super.updated(props)
		this.metaIcon = this.detailsMenu ? 'arrow_right' : undefined
	}

	private initializeDetailsMenuIfExists() {
		if (!this.detailsMenu) {
			return
		}
		this.detailsMenu.absolute = true
		this.detailsMenu.open = true
		this.detailsMenu.anchor = document.body
	}

	private get detailsMenu() {
		return this.querySelector<Menu>('mo-context-menu[slot=details]')
	}

	private set detailsMenuOpen(value: boolean) {
		if (!this.detailsMenu) {
			return
		}
		this.detailsMenu.requestUpdate()
		this.open = value
		this.openChange.dispatch(value)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-context-menu-item': ContextMenuItem
	}
}