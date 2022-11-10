import { component, css } from '@a11d/lit'
import { ComponentMixin } from '../../library'
import { LabelMixin, InputMixin } from '../helpers'
import { Switch as MwcSwitch } from '@material/mwc-switch'

/**
 * @attr selected
 * @attr disabled
 * @fires change {CustomEvent}
 */
@component('mo-switch')
export class Switch extends InputMixin(LabelMixin(ComponentMixin(MwcSwitch))) {
	static override get styles() {
		return [
			...super.styles,
			css`
				:host {
					--mdc-switch-selected-handle-color: var(--mo-color-accent-gradient);
					--mdc-switch-selected-focus-handle-color: var(--mdc-switch-selected-handle-color);
					--mdc-switch-selected-hover-handle-color: var(--mdc-switch-selected-handle-color);
					--mdc-switch-selected-pressed-handle-color: var(--mdc-switch-selected-handle-color);

					--mdc-switch-selected-track-color: rgba(var(--mo-color-accent-base), 0.5);
					--mdc-switch-selected-focus-track-color: var(--mdc-switch-selected-track-color);
					--mdc-switch-selected-hover-track-color: var(--mdc-switch-selected-track-color);
					--mdc-switch-selected-pressed-track-color: var(--mdc-switch-selected-track-color);

					--mdc-switch-selected-focus-state-layer-color: var(--mo-color-accent);
					--mdc-switch-selected-hover-state-layer-color: var(--mo-color-accent);
					--mdc-switch-selected-pressed-state-layer-color: var(--mo-color-accent);

					--mdc-switch-selected-icon-color: var(--mo-color-accessible);

					--mdc-switch-unselected-handle-color: var(--mo-color-foreground);
					--mdc-switch-unselected-focus-handle-color: var(--mdc-switch-unselected-handle-color);
					--mdc-switch-unselected-hover-handle-color: var(--mdc-switch-unselected-handle-color);
					--mdc-switch-unselected-pressed-handle-color: var(--mdc-switch-unselected-handle-color);

					--mdc-switch-unselected-track-color: rgba(var(--mo-color-foreground-base), 0.25);
					--mdc-switch-unselected-focus-track-color: var(--mdc-switch-unselected-track-color);
					--mdc-switch-unselected-hover-track-color: var(--mdc-switch-unselected-track-color);
					--mdc-switch-unselected-pressed-track-color: var(--mdc-switch-unselected-track-color);

					--mdc-switch-unselected-focus-state-layer-color: var(--mo-color-foreground);
					--mdc-switch-unselected-hover-state-layer-color: var(--mo-color-foreground);
					--mdc-switch-unselected-pressed-state-layer-color: var(--mo-color-foreground);

					--mdc-switch-unselected-icon-color: var(--mo-color-background);
				}

				.mdc-switch {
					margin-right: 6px;
				}
			`
		]
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-switch': Switch
	}
}