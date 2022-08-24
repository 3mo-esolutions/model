import { render, query, css, html, event, CSSResult, property, style } from '../../library'
import { MaterialIcon } from '.'
import { ListItem as MwcListItem } from '@material/mwc-list/mwc-list-item'

export const ListItemMixin = <T extends Constructor<MwcListItem>>(Constructor: T) => {
	/**
	 * @slot graphic
	 * @slot meta
	 * @slot secondary
	 */
	abstract class ListItemMixinConstructor extends Constructor {
		@event() readonly selectionChange!: EventDispatcher<boolean>

		@property() icon?: MaterialIcon
		@property() metaIcon?: MaterialIcon

		@query('slot[name="graphic"]') private readonly graphicSlot?: HTMLSlotElement
		@query('slot[name="meta"]') private readonly metaSlot?: HTMLSlotElement

		constructor(...args: Array<any>) {
			super(...args)
			this.hasMeta = !!Array.from(this.children).find(child => child.slot === 'meta')
			this.graphic = Array.from(this.children).find(child => child.slot === 'graphic') ? 'control' : null
			this.twoline = !!Array.from(this.children).find(child => child.slot === 'secondary')
		}

		static get styles() {
			return [
				/* @ts-expect-error Material components do have styles, but it is compiled from SASS, therefore not recognized AoT */
				...super.styles,
				css`
					.mdc-deprecated-list-item__meta {
						width: var(--mdc-list-item-meta-width, var(--mdc-list-item-meta-size, 24px));
						height: var(--mdc-list-item-meta-height, var(--mdc-list-item-meta-size, 24px));
					}
				`
			] as Array<CSSResult>
		}

		protected initialized() {
			this.renderIcon()
			this.renderMetaIcon()
		}

		override render() {
			this.renderIcon()
			this.renderMetaIcon()
			return super.render()
		}

		private async renderIcon() {
			if (!this.icon) {
				return
			}

			this.graphic = 'icon'
			await this.updateComplete

			if (!this.graphicSlot) {
				return
			}

			await this.updateComplete
			render(html`<mo-icon icon=${this.icon} ${style({ color: 'var(--mo-list-item-icon-color)', opacity: '0.75' })}></mo-icon>`, this.graphicSlot)
		}

		private async renderMetaIcon() {
			if (!this.metaIcon) {
				return
			}

			this.hasMeta = true
			await this.updateComplete

			if (!this.metaSlot) {
				return
			}

			render(html`<mo-icon icon=${this.metaIcon} ${style({ color: 'var(--mo-list-item-meta-icon-color)', opacity: '0.75' })}></mo-icon>`, this.metaSlot)
		}
	}
	return ListItemMixinConstructor
}