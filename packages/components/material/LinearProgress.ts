import { component, ComponentMixin, css } from '../../library'
import { LinearProgress as MwcLinearProgress } from '@material/mwc-linear-progress'

/**
 * @attr indeterminate
 * @attr progress
 * @attr buffer
 * @attr reverse
 * @attr close
 */
@component('mo-linear-progress')
export class LinearProgress extends ComponentMixin(MwcLinearProgress) {
	static override get styles() {
		return [
			...super.styles,
			css`
				:host {
					--mdc-linear-progress-buffer-color: var(--mo-color-gray-transparent);
				}
			`
		]
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-linear-progress': LinearProgress
	}
}