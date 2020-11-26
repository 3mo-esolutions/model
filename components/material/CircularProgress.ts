import { component, property, componentize } from '../../library'
import { CircularProgressFourColor as MwcCircularProgress } from '@material/mwc-circular-progress-four-color'

/**
 * @attr indeterminate
 * @attr progress
 * @attr closed
 */
@component('mdc-circular-progress')
export default class CircularProgress extends componentize(MwcCircularProgress) {
	@property({ type: Boolean })
	set fourColor(value: boolean) {
		this.style.setProperty('--mdc-circular-progress-bar-color-1', value ? '#2196f3' : '--mdc-theme-primary')
		this.style.setProperty('--mdc-circular-progress-bar-color-2', value ? '#e91e63' : '--mdc-theme-primary')
		this.style.setProperty('--mdc-circular-progress-bar-color-3', value ? '#ffc107' : '--mdc-theme-primary')
		this.style.setProperty('--mdc-circular-progress-bar-color-4', value ? '#03dac5' : '--mdc-theme-primary')
	}
}