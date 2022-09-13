import { css } from '../../library'
import { PageComponent, PageParameters } from '../../shell'

export abstract class PageSettings<T extends PageParameters = void> extends PageComponent<T> {
	static override get styles() {
		return css`
			[mwc-list-item]:not(mo-option) {
				background: var(--mo-color-surface);
				border-radius: var(--mo-border-radius);
				box-shadow: var(--mo-shadow);
			}
		`
	}
}