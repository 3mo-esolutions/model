import { Component, component, eventListener, html, nothing, property, style, TemplateResult } from '@a11d/lit'
import { Key, PageComponent, routerLink } from '@a11d/lit-application'
import { Navigation } from '.'
import { ContextMenuHost } from '../contextMenu'

@component('mo-navigation-item')
export class NavigationItem extends Component {
	@property({ type: Object }) navigation!: Navigation
	@property({
		type: Boolean,
		async updated(this: NavigationItem) {
			if (!this.navigation.children) {
				if (this.open === true) {
					this.open = false
				}
				return
			}
			const handler = () => {
				this.open = false
				ContextMenuHost.contextMenu.removeEventListener('open', handler)
			}
			if (this.open) {
				await ContextMenuHost.open(this, 'BOTTOM_LEFT', this.menuTemplate)
				ContextMenuHost.contextMenu.addEventListener('closed', handler)
			} else {
				ContextMenuHost.contextMenu?.close()
			}
		}
	}) open = false

	override tabIndex = 0

	private get menuTemplate() {
		const getItemTemplate = (navigation: Navigation): TemplateResult => navigation.hidden ? nothing : !navigation.children ? html`
			<mo-navigation-list-item ${!navigation.component ? nothing : routerLink({
				component: navigation.component as PageComponent,
				matchMode: navigation.matchMode,
				invocationHandler: () => this.open = false
			})}>${navigation.label} ${navigation.openInNewPage ? '...' : ''}</mo-navigation-list-item>
		` : html`
			<mo-context-menu-item>
				${navigation.label}
				<mo-context-menu activatable absolute slot='details'>
					${navigation.children.map(child => getItemTemplate(child))}
				</mo-context-menu>
			</mo-context-menu-item>
		`

		return !this.navigation.children || this.navigation.hidden ? nothing : html`
			<style>
				mo-navigation-list-item[selected] {
					background: var(--mo-color-accent-gradient-transparent);
					color: var(--mo-color-accent)
				}
			</style>
			${this.navigation.children.map(child => getItemTemplate(child))}
		`
	}

	override disconnected() {
		ContextMenuHost.contextMenu?.close()
	}

	@eventListener('click')
	protected readonly clickHandler = () => this.open = true

	@eventListener('keydown')
	protected keyDownHandler(e: KeyboardEvent) {
		if (e.keyCode === 32) {
			this.open = !this.open
		} else if (e.key === Key.Enter) {
			this.open = true
		} else if (e.key === Key.Escape) {
			this.open = false
		}
	}

	protected override get template() {
		return html`
			<style>
				:host {
					position: relative;
					display: inline-block;
					border-radius: var(--mo-border-radius);
					padding: 0 var(--mo-thickness-l);
					color: var(--mo-color-accessible);
					cursor: pointer;
					white-space: nowrap;
				}

				:host([data-router-selected]) {
					background-color: rgba(var(--mo-color-background-base), 0.12);
				}

				:host(:hover) {
					background-color: rgba(var(--mo-color-background-base), 0.12);
				}

				span {
					line-height: 2rem;
					font-weight: 500;
					letter-spacing: 0.0125em;
					font-size: var(--mo-font-size-m);
				}
			</style>
			<mo-flex direction='horizontal' alignItems='center' justifyContent='center' gap='var(--mo-thickness-xs)'>
				<span>${this.navigation.label}</span>
				${!this.navigation.children ? nothing : html`
					<mo-icon icon=${this.open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} ${style({ fontSize: 'var(--mo-font-size-l)' })}></mo-icon>
				`}
			</mo-flex>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-navigation-item': NavigationItem
	}
}