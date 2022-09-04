import { css, component, html } from '../../../library'
import { DataGridRow } from './DataGridRow'

@component('mo-data-grid-default-row')
export class DataGridDefaultRow<TData, TDetailsElement extends Element | undefined = undefined> extends DataGridRow<TData, TDetailsElement> {
	static override get styles() {
		return css`
			${super.styles}

			mo-grid {
				height: var(--mo-data-grid-row-height);
				grid-template-columns: var(--mo-data-grid-columns);
				column-gap: var(--mo-data-grid-columns-gap);
			}

			mo-flex {
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}

			#selectionContainer {
				height: var(--mo-data-grid-row-height);
			}

			/* Tree-view borders
				#detailsContainer [mo-data-grid]::before {
					content: '';
					width: 2px;
					height: calc(100% - var(--mo-details-data-grid-left-margin) + 5px - calc(var(--mo-data-grid-row-height)));
					top: calc(var(--mo-data-grid-row-height) / 2 + 3px);
					position: absolute;
					background-color: var(--mo-color-gray-alpha-1);
					/* Because of the background color of rows
					z-index: 1;
				}

				:host([isSubRow]) mo-grid::before {
					content: '';
					width: var(--mo-data-grid-row-tree-line-width, 8px);
					border-top: 2px solid var(--mo-color-gray);
					margin-left: calc(var(--mo-details-data-grid-left-margin) * -1);
					position: absolute;
					top: calc(50% - 1px);
					height: 0px;
				}
			*/
		`
	}

	protected override get rowTemplate() {
		return html`
			${this.detailsExpanderTemplate}
			${this.selectionTemplate}
			${this.dataGrid.columns.map(column => this.getCellTemplate(column))}
			${this.contextMenuIconButtonTemplate}
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-data-grid-default-row': DataGridRow<unknown>
	}
}