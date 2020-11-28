import { component, property, componentize } from '../../library'
import { CircularProgressFourColor as MwcCircularProgress } from '@material/mwc-circular-progress-four-color'

/**
 * @attr indeterminate
 * @attr progress
 * @attr closed
 */
@component('mo-circular-progress')
export default class CircularProgress extends componentize(MwcCircularProgress) {
	@property({ type: Boolean })
	set fourColor(value: boolean) {
		this.style.setProperty('--mo-circular-progress-bar-color-1', value ? '#2196f3' : '--mo-theme-primary')
		this.style.setProperty('--mo-circular-progress-bar-color-2', value ? '#e91e63' : '--mo-theme-primary')
		this.style.setProperty('--mo-circular-progress-bar-color-3', value ? '#ffc107' : '--mo-theme-primary')
		this.style.setProperty('--mo-circular-progress-bar-color-4', value ? '#03dac5' : '--mo-theme-primary')
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-circular-progress': CircularProgress
	}
}