import { render, query, css, html, TemplateResult, event } from '../../library'
import { property } from 'lit-element'
import { MaterialIcon } from '../../types'
import { ListItem as MwcListItem } from '@material/mwc-list/mwc-list-item'

export const ListItemMixin = <T extends Constructor<MwcListItem>>(Constructor: T) => {
	abstract class ListItemMixinConstructor extends Constructor {
		@event() readonly selectionChange!: IEvent<boolean>

		constructor(...args: Array<any>) {
			super(...args)
			this.hasMeta = !!Array.from(this.children).find(child => child.slot === 'meta')
			this.graphic = Array.from(this.children).find(child => child.slot === 'graphic') ? 'control' : null
			this.twoline = !!Array.from(this.children).find(child => child.slot === 'secondary')
		}

		static get styles() {
			return [
				/* @ts-ignore Material components do have styles, but it is compiled from SASS, therefore not recognized AoT */
				super.styles,
				css`
					.mdc-deprecated-list-item__meta {
						width: var(--mdc-list-item-meta-width, var(--mdc-list-item-meta-size, 24px));
						height: var(--mdc-list-item-meta-height, var(--mdc-list-item-meta-size, 24px));
					}
				`
			]
		}

		@property() icon?: MaterialIcon
		@property() metaIcon?: MaterialIcon

		protected initialized() {
			this.renderIcon()
			this.renderMetaIcon()
		}

		render() {
			this.renderIcon()
			this.renderMetaIcon()
			return super.render() as TemplateResult
		}

		@query('slot[name="graphic"]') private readonly graphicSlot?: HTMLSlotElement
		@query('slot[name="meta"]') private readonly metaSlot?: HTMLSlotElement

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
			render(html`<mo-icon icon=${this.icon} foreground='var(--mo-list-item-icon-color)' opacity='0.75'></mo-icon>`, this.graphicSlot)
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

			render(html`<mo-icon icon=${this.metaIcon} foreground='var(--mo-list-item-meta-icon-color)' opacity='0.75'></mo-icon>`, this.metaSlot)
		}
	}
	return ListItemMixinConstructor
}