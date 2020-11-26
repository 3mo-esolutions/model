import { component, html, property, TemplateResult, componentize } from '../../library'
import { ListItem as MwcListItem } from '@material/mwc-list/mwc-list-item'
import { MaterialIcon } from '../../types'

/**
 * @attr value
 * @attr group
 * @attr disabled
 * @attr activated
 * @attr noninteractive
 * @attr selected
 * @fires request-selected
 */
@component('mdc-list-item')
export default class ListItem extends componentize(MwcListItem) {
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
				<mdc-icon icon=${this.icon} opacity='0.75'></mdc-icon>
			</span>
		`
	}

	protected renderMeta() {
		return html`
			<span class='mdc-list-item__meta'>
				<mdc-icon icon=${this.metaIcon} opacity='0.75'></mdc-icon>
			</span>
		`
	}
}