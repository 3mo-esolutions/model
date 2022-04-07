import { component, ComponentMixin, css } from '../../library'
import { CircularProgressFourColor as MwcCircularProgress } from '@material/mwc-circular-progress-four-color'

/**
 * @attr indeterminate
 * @attr progress
 * @attr closed
 */
@component('mo-circular-progress')
export class CircularProgress extends ComponentMixin(MwcCircularProgress) {
	static override get styles() {
		return [
			...super.styles,
			css`
				:host {
					width: 48px;
					height: 48px;
				}

				.mdc-circular-progress {
					width: 100% !important;
					height: 100% !important;
				}
			`
		]
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-circular-progress': CircularProgress
	}
}