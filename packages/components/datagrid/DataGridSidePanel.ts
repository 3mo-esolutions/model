import { component, Component, css, html, ifDefined, property } from '../../library'
import { Localizer } from '../../localization'
import { Checkbox } from '../..'
import { ColumnDefinition } from './ColumnDefinition'
import { DataGrid } from './DataGrid'

Localizer.register(LanguageCode.German, {
	'Settings': 'Einstellungen',
	'Filters': 'Filter',
	'Export as Excel file': 'Als Excel-Datei Exportieren',
	'Columns': 'Spalten',
})

export const enum DataGridSidePanelTab {
	Settings = 'settings',
	Filters = 'filters',
}

@component('mo-data-grid-side-panel')
export class DataGridSidePanel<TData> extends Component {
	@property({ type: Object }) dataGrid!: DataGrid<TData, any>
	@property() tab?: DataGridSidePanelTab

	static override get styles() {
		return css`
			:host {
				display: inline-block !important;
				transition: var(--mo-duration-quick);
				width: 100%;
				height: 100%;
				transform-origin: right center;
			}

			:host(:not([hidden])) {
				border-left: var(--mo-data-grid-border);
				background: var(--mo-color-transparent-gray-1);
				opacity: 1;
			}

			:host([hidden]) {
				opacity: 0;
				transform: scale(0, 1);
				width: 0;
			}

			#flexHeading {
				border-top: var(--mo-data-grid-border);
				border-bottom: var(--mo-data-grid-border);
				height: var(--mo-data-grid-header-height);
				padding-left: var(--mo-thickness-xl);
			}

			mo-scroll {
				width: calc(100% - calc(2 * var(--mo-thickness-xl)));
				padding: 0 var(--mo-thickness-xl);
				margin-top: var(--mo-thickness-xl);
				overflow-x: hidden;
				--mo-scroll-width: calc(100% - calc(2 * var(--mo-thickness-xl)));
			}

			mo-section mo-checkbox {
				margin-left: -6px;
			}

			mo-section mo-icon-button {
				margin-left: -10px;
			}
		`
	}

	protected override get template() {
		return html`
			<mo-flex height='100%'>
				<mo-tab-bar
					value=${ifDefined(this.dataGrid.sidePanelTab)}
					?hidden=${this.dataGrid.hasToolbar || this.dataGrid.hasFilters === false}
					preventFirstTabNavigation
					@navigate=${(e: CustomEvent<DataGridSidePanelTab | undefined>) => this.dataGrid.navigateToSidePanelTab(e.detail ?? DataGridSidePanelTab.Settings)}
				>
					<mo-tab icon='filter_list' value=${DataGridSidePanelTab.Filters}></mo-tab>
					<mo-tab icon='settings' value=${DataGridSidePanelTab.Settings}></mo-tab>
				</mo-tab-bar>

				<mo-flex id='flexHeading' direction='horizontal' alignItems='center' ?hidden=${this.dataGrid.hasToolbar === false && this.dataGrid.hasFilters === true}>
					<mo-heading width='*' typography='heading6' foreground='var(--mo-color-on-surface)'>${_(this.dataGrid.sidePanelTab === DataGridSidePanelTab.Filters ? 'Filters' : 'Settings')}</mo-heading>
					<mo-icon-button icon='close' small cursor='pointer' foreground='var(--mo-color-gray)' @click=${() => this.dataGrid.navigateToSidePanelTab(undefined)}></mo-icon-button>
				</mo-flex>

				<mo-scroll height='*'>
					${this.dataGrid.sidePanelTab === DataGridSidePanelTab.Filters ? this.filtersTemplate : this.settingsTemplate}
				</mo-scroll>
			</mo-flex>
		`
	}

	protected get filtersTemplate() {
		return html`
			<mo-flex gap='var(--mo-thickness-xl)'>
				<slot name='filter'></slot>
			</mo-flex>
		`
	}

	protected get settingsTemplate() {
		return html`
			<mo-flex gap='var(--mo-thickness-xl)'>
				<slot name='settings'></slot>

				<mo-section heading=${_('Columns')}>
					${this.dataGrid.columns.map(this.getColumnTemplate)}
				</mo-section>

				<mo-section heading='Tools'>
					<mo-icon-button icon='file_download'
						title=${_('Export as Excel file')}
						@click=${() => this.dataGrid.exportExcelFile()}
					></mo-icon-button>
				</mo-section>
			</mo-flex>
		`
	}

	private readonly getColumnTemplate = (column: ColumnDefinition<TData>) => {
		const change = async (e: CustomEvent<undefined, Checkbox>) => {
			column.hidden = e.source.checked === false
			this.dataGrid.setColumns(this.dataGrid.columns)
			this.dataGrid.requestUpdate()
			await this.dataGrid.updateComplete
		}
		return html`
			<mo-checkbox
				height='30px'
				label=${column.heading}
				?checked=${column.hidden === false}
				@change=${change}
			></mo-checkbox>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-data-grid-side-panel': DataGridSidePanel<unknown>
	}
}