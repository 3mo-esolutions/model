import { component } from '../../library'
import { ListItem } from '.'

@component('mo-option')
export default class Option extends ListItem { }

declare global {
	interface HTMLElementTagNameMap {
		'mo-option': Option
	}
}