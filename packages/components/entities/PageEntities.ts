/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { css } from '../../library'
import { PageComponent, PageParameters } from '../../shell'
import { Entity } from '.'

export abstract class PageEntities<_TEntity extends Entity, T extends PageParameters = void> extends PageComponent<T> {
	static override get styles() {
		return css`
			mo-card {
				--mo-card-body-padding: 0px;
				position: relative;
			}
		`
	}
}