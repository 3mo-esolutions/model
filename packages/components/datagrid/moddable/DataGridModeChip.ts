import { html, component, css, property, eventListener, renderContainer, nothing, style } from '../../../library'
import { DialogAcknowledge, DialogAlert, Chip, DialogDeletion } from '../..'
import { ContextMenuHost } from '../../../shell'
import { Localizer } from '../../../localization'
import { DialogDataGridMode, ModdableDataGrid, Mode } from '.'

Localizer.register(LanguageCode.German, {
	'Changing Filter': 'Filterwechsel',
	'Save changes': 'Änderungen speichern',
	'Discard changes': 'Änderungen verwerfen',
	'Archive': 'Archivieren',
	'Unarchive': 'Dearchivieren',
	'Edit': 'Bearbeiten',
	'Discard': 'Verwerfen',
	'Do you want to delete the view "${name:string}"?': 'Soll die Ansicht "${name}" gelöscht werden?',
	'This process is irreversible.': 'Dieser Vorgang ist unwiderruflich.',
	'Don\'t Save': 'Nicht speichern',
	'Unsaved changes': 'Ungespeicherte Änderungen',
	'Do you want to save the new changes to "${name:string}" before switching views?': 'Sollen die neuen Änderungen vor dem Ansichtswechsel in "${name}" gespeichert werden?',
	'Do you want to discard changes of "${name:string}"?': 'Sollen die Änderungen vor "${name}" verworfen werden?'
})

@component('mo-data-grid-mode-chip')
export class DataGridModeChip extends Chip {
	@property({
		type: Object,
		updated(this: DataGridModeChip) {
			const handler = () => this.requestUpdate()
			this.moddableDataGrid.columnsChange.subscribe(handler)
			this.moddableDataGrid.sortingChange.subscribe(handler)
			this.moddableDataGrid.parametersChange.subscribe(handler)
			this.moddableDataGrid.paginationChange.subscribe(handler)
			this.moddableDataGrid.modeChange.subscribe(handler)
		}
	}) moddableDataGrid!: ModdableDataGrid<unknown>

	@property({
		type: Object,
		updated(this: DataGridModeChip) {
			this.title = this.mode.name
			this.label = this.mode.isArchived ? `[${this.mode.name}]` : this.mode.name
		}
	}) mode!: Mode<unknown, any>

	@property({ type: Boolean, reflect: true }) selected = false
	@property({ type: Boolean, reflect: true }) readOnly = false

	static override get styles() {
		return [...super.styles, css`
			:host {
				white-space: nowrap;
			}

			:host(:hover) {
				--mdc-theme-primary: var(--mo-color-accent-transparent);
			}

			:host([selected]) {
				--mdc-theme-primary: var(--mo-color-accent);
				--mdc-theme-on-primary: var(--mo-color-accessible);
			}

			button {
				padding: 0px 16px !important;
				transition: 100ms;
			}

			:host([selected]:not([readOnly])) button {
				padding-right: 8px !important;
			}

			mo-icon-button {
				color: var(--mo-color-accessible);
				--mdc-icon-size: 18px;
			}

			:host([selected]:not([readOnly])) mo-icon-button:not([data-no-border]) {
				border-left: 1px solid var(--mo-color-gray-transparent);
			}
		`]
	}

	@eventListener('click')
	protected async handleClick() {
		if (this.moddableDataGrid.modesRepository.isSelected(this.mode)) {
			this.moddableDataGrid.mode = undefined
		} else {
			if (this.moddableDataGrid.modesRepository.isSelectedModeSaved === false) {
				const result = await new DialogAcknowledge({
					heading: _('Unsaved changes'),
					content: _('Do you want to save the new changes to "${name:string}" before switching views?'),
					primaryButtonText: _('Save'),
					secondaryButtonText: _('Don\'t Save'),
				}).confirm()

				if (result === true) {
					this.moddableDataGrid.modesRepository.save()
				}
			}

			this.moddableDataGrid.mode = this.mode
		}
	}

	@eventListener('contextmenu')
	protected handleRightClick(e: MouseEvent) {
		e.preventDefault()
		this.editMode(e)
	}

	protected override renderRipple() {
		return nothing
	}

	@renderContainer('slot[name="trailingIcon"]')
	protected override get trailingTemplate() {
		return this.readOnly || !this.selected ? nothing : html`
			<mo-flex direction='horizontal'>
				${this.moddableDataGrid.modesRepository.isSelectedModeSaved ? nothing : html`
					<span id='spanUnsaved'>*</span>

					<mo-icon-button icon='undo' tabindex='-1' small ${style({ marginLeft: '0 0 0 12px' })}
						title=${_('Discard changes')}
						@click=${this.discardChanges}
					></mo-icon-button>

					<mo-icon-button icon='save' tabindex='-1' small
						title=${_('Save changes')}
						@click=${this.saveChanges}
					></mo-icon-button>
				`}

				<mo-icon-button ?data-no-border=${this.moddableDataGrid.modesRepository.isSelectedModeSaved} icon='more_vert' tabindex='-1' small @click=${this.openMenu}></mo-icon-button>
			</mo-flex>
		`
	}

	protected readonly openMenu = (e: MouseEvent) => {
		e.stopImmediatePropagation()
		ContextMenuHost.open(this, 'BOTTOM_START', html`
			${this.moddableDataGrid.modesRepository.isSelectedModeSaved ? nothing : html`
				<mo-context-menu-item icon='undo' @click=${this.discardChanges}>${_('Discard changes')}</mo-context-menu-item>
				<mo-context-menu-item icon='save' @click=${this.saveChanges}>${_('Save changes')}</mo-context-menu-item>
				<mo-line ${style({ margin: '4px 0' })}></mo-line>
			`}
			<mo-context-menu-item icon='edit' @click=${this.editMode}>${_('Edit')}</mo-context-menu-item>
			${this.mode.isArchived === false ? html`
				<mo-context-menu-item icon='archive'
					@click=${() => this.moddableDataGrid.modesRepository.archive(this.mode)}
				>${_('Archive')}</mo-context-menu-item>
			` : html`
				<mo-context-menu-item icon='unarchive'
					@click=${() => this.moddableDataGrid.modesRepository.unarchive(this.mode)}
				>${_('Unarchive')}</mo-context-menu-item>
			`}
			<mo-context-menu-item icon='delete' @click=${this.deleteMode}>${_('Delete')}</mo-context-menu-item>
		`)
	}

	private readonly discardChanges = async (e: MouseEvent) => {
		e.stopImmediatePropagation()
		await new DialogAlert({
			heading: _('Discard changes'),
			content: _('Do you want to discard changes of "${name:string}"?', { name: this.mode.name }),
			primaryButtonText: _('Discard'),
		}).confirm()
		this.moddableDataGrid.modesRepository.save(this.mode)
	}

	private readonly saveChanges = (e: MouseEvent) => {
		e.stopImmediatePropagation()
		this.moddableDataGrid.modesRepository.save()
	}

	private readonly editMode = async (e: MouseEvent) => {
		e.stopImmediatePropagation()
		await new DialogDataGridMode({ moddableDataGrid: this.moddableDataGrid, mode: this.mode }).confirm()
	}

	private readonly deleteMode = async (e: MouseEvent) => {
		e.stopImmediatePropagation()
		await new DialogDeletion({
			content: `${_('Do you want to delete the view "${name:string}"?', { name: this.mode.name })} ${_('This process is irreversible.')}`,
			deletionAction: () => this.moddableDataGrid.modesRepository.remove(this.mode)
		}).confirm()
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-data-grid-mode-chip': DataGridModeChip
	}
}