import { component, html, property, TemplateResult, ComponentMixin } from '../../library'
import { ListItem as MwcListItem } from '@material/mwc-list/mwc-list-item'
import { MaterialIcon } from '../../types'

/**
 * @attr value
 * @attr group
 * @attr disabled
 * @attr activated
 * @attr noninteractive
 * @attr selected
 * @fires select
 */
@component('mo-list-item')
export default class ListItem extends ComponentMixin(MwcListItem) {
	constructor() {
		super()
		this.hasMeta = !!Array.from(this.children).find(child => child.slot === 'meta')
		this.graphic = Array.from(this.children).find(child => child.slot === 'graphic') ? 'control' : null
		this.twoline = !!Array.from(this.children).find(child => child.slot === 'secondary')
		this.addEventListener('request-selected', () => this.select.trigger())
	}

	@eventProperty select!: IEvent
	@property() icon!: MaterialIcon
	@property() metaIcon!: MaterialIcon

	render() {
		this.graphic = this.icon ? 'icon' : null
		this.hasMeta = !!this.metaIcon
		return super.render() as TemplateResult
	}

	protected renderGraphic() {
		return html`
			<span class='mdc-list-item__graphic'>
				<mo-icon icon=${this.icon} opacity='0.75'></mo-icon>
			</span>
		`
	}

	protected renderMeta() {
		return html`
			<span class='mdc-list-item__meta'>
				<mo-icon icon=${this.metaIcon} opacity='0.75'></mo-icon>
			</span>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-list-item': ListItem
	}
}