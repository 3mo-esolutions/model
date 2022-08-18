import { component, Component, html, property, nothing, css } from '../../library'
import { Localizer } from '../../../localization'
import { NotificationHost } from '../../../shell'
import { ColumnDefinition, DataGridRow } from '.'

Localizer.register(LanguageCode.German, {
	'Using the clipboard is not allowed in an insecure browser environment': 'In einer unsicheren Browser-Umgebung darf kein Text in die Zwischenablage kopiert werden',
	'Copied to clipboard': 'In die Zwischenablage kopiert',
})

@component('mo-data-grid-cell')
export class DataGridCell<TValue extends KeyPathValueOf<TData>, TData = any, TDetailsElement extends Element | undefined = undefined> extends Component {
	@property({ type: Object }) value!: TValue
	@property({ type: Object }) column!: ColumnDefinition<TData, TValue>
	@property({ type: Object }) row!: DataGridRow<TData, TDetailsElement>
	@property({ type: Boolean, reflect: true }) editing = false

	get data() { return this.row.data }
	get dataSelector() { return this.column.dataSelector }

	handleEdit(value: TValue | undefined) {
		if (value !== undefined && this.value !== value) {
			this.row.requestUpdate()
			setPropertyByKeyPath(this.data, this.dataSelector, value)
			this.row.dataGrid.cellEdit.dispatch(this)
		}
	}

	static override get styles() {
		return css`
			:host {
				position: relative;
				padding: 0px var(--mo-data-grid-cell-padding, 3px);
				user-select: none;
				line-height: var(--mo-data-grid-row-height);
				white-space: nowrap;
				overflow: hidden !important;
				text-overflow: ellipsis;
				font-size: var(--mo-font-size-s);
			}

			:host([editing]) {
				display: grid;
			}

			:host([alignment=right]) {
				text-align: right;
			}

			:host([alignment=left]) {
				text-align: left;
			}

			:host([alignment=center]) {
				text-align: center;
			}

			#copyIconButton {
				visibility: hidden;
				opacity: 0;
				transition: all var(--mo-duration-quick) ease-in-out;
				border-radius: 50%;
				height: 30px;
				background: var(--mo-color-surface);
				color: var(--mo-accent);
				position: absolute;
				top: calc((var(--mo-data-grid-row-height) - 30px) / 2);
			}

			:host(:not([editing]):hover) #copyIconButton {
				visibility: visible;
				opacity: 1;
				transition-delay: 0.25s;
			}

			:host(:not([editing]):hover) {
				transition: padding var(--mo-duration-quick) ease-in-out;
			}

			:host([alignment=right]:not([editing]):hover) {
				padding-left: 30px;
			}

			:host(:not([alignment=right]):not([editing]):hover) {
				padding-right: 30px;
			}

			:host > :first-child {
				line-height: var(--mo-data-grid-row-height);
			}

			:host([editing]) > :first-child {
				align-self: center;
				justify-self: stretch;
			}
		`
	}

	private get tooltip() {
		const allowedTitleTypes = ['string', 'number', 'bigint', 'boolean']
		return allowedTitleTypes.includes(typeof this.value) ? String(this.value) : ''
	}

	protected override get template() {
		this.title = this.tooltip
		const contentTemplate = this.column.getContentTemplate?.(this.value, this.data) ?? this.value
		const editContentTemplate = this.column.getEditContentTemplate?.(this.value, this.data)
		this.setAttribute('alignment', this.column.alignment || 'left')
		return this.column.editable && this.editing && editContentTemplate ? editContentTemplate : html`
			${contentTemplate}
			${this.copyIconButtonTemplate}
		`
	}

	private get copyIconButtonTemplate() {
		return !window.isSecureContext ? nothing : html`
			<mo-icon-button id='copyIconButton' icon='copy' small
				title=${`${this.column.heading} kopieren`}
				right=${this.column.alignment === 'right' ? 'unset' : '4px'}
				left=${this.column.alignment !== 'right' ? 'unset' : '4px'}
				@click=${this.copyIconButtonClick}
			></mo-icon-button>
		`
	}

	private readonly copyIconButtonClick = async (e: MouseEvent) => {
		e.stopImmediatePropagation()
		if (!window.isSecureContext) {
			NotificationHost.instance.notifyAndThrowError(_('Using the clipboard is not allowed in an insecure browser environment'))
		}
		await navigator.clipboard.writeText(String(this.value))
		NotificationHost.instance.notifySuccess(_('Copied to clipboard'))
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-data-grid-cell': DataGridCell<unknown>
	}
}