import { component, property, PropertyValues, html, nothing, TemplateResult } from '../../library'
import { FetchableDataGridParametersType, FetchableDataGrid, DialogEntity, Entity } from '..'

type CreateAction = (() => unknown | PromiseLike<unknown>)
type EditAction<TEntity extends Entity> = ((entity: TEntity) => unknown | PromiseLike<unknown>)

type CreateOrEditAction<TEntity extends Entity> = CreateAction | EditAction<TEntity>

@component('mo-data-grid-entity')
export class DataGridEntity<TEntity extends Entity, TDataFetcherParameters extends FetchableDataGridParametersType = Record<string, never>, TDetailsElement extends Element | undefined = undefined> extends FetchableDataGrid<TEntity, TDataFetcherParameters, TDetailsElement> {
	@property({ type: Boolean }) disableEditOnClick = false
	@property({ type: Object }) create?: CreateAction | Constructor<DialogEntity<TEntity>>
	@property({ type: Object }) edit?: EditAction<TEntity> | Constructor<DialogEntity<TEntity>>
	@property({ type: Object }) delete?: (...entities: Array<TEntity>) => void | PromiseLike<void>
	@property({ type: Object }) rowContextMenuTemplate?: (rowData: Array<TEntity>) => TemplateResult

	@property({
		type: Object,
		updated(this: DataGridEntity<Entity>) {
			if (this.createOrEdit) {
				this.create = this.createOrEdit as CreateAction
				this.edit = this.createOrEdit
			}
		}
	}) createOrEdit?: CreateOrEditAction<TEntity> | Constructor<DialogEntity<TEntity>>

	override silentFetch = true

	override parameters = {} as TDataFetcherParameters

	protected override firstUpdated(props: PropertyValues) {
		super.firstUpdated(props)
		this.setupRowClick()
	}

	protected override get fabTemplate() {
		return html`
			${!this.create ? nothing : html`<mo-fab icon='add' @click=${() => this.createAndRefetch()}></mo-fab>`}
			${super.fabTemplate}
		`
	}

	private setupRowClick() {
		this.rowClick.subscribe(row => {
			if (this.disableEditOnClick === false) {
				this.editAndRefetch(row.data)
			}
		})
	}

	override getRowContextMenuTemplate = (entities: Array<TEntity>) => {
		return html`
			${this.rowContextMenuTemplate?.(entities) ?? nothing}
			${!this.edit || entities.length !== 1 ? nothing : html`<mo-context-menu-item icon='edit' data-test-id='edit' @click=${() => this.editAndRefetch(entities[0]!)}>Bearbeiten</mo-context-menu-item>`}
			${!this.delete ? nothing : html`<mo-context-menu-item icon='delete' data-test-id='delete' @click=${() => this.deleteAndRefetch(entities)}>Löschen</mo-context-menu-item>`}
		`
	}

	private async createAndRefetch() {
		if (!this.create) {
			return
		}
		const promise = this.isEntityDialogClass(this.create)
			? this.confirmDialogEntity(new this.create({}))
			: this.create()
		await promise
		await this.refetchData()
	}

	private async editAndRefetch(entity: TEntity) {
		if (!this.edit) {
			return
		}
		const promise = this.isEntityDialogClass(this.edit)
			? this.confirmDialogEntity(new this.edit({ id: entity.id }))
			: this.edit(entity)
		await promise
		await this.refetchData()
	}

	private async confirmDialogEntity(dialog: DialogEntity<TEntity>) {
		try {
			await dialog.confirm()
		} finally {
			// Continue
		}
	}

	private async deleteAndRefetch(entities: Array<TEntity>) {
		if (!this.delete) {
			return
		}
		await this.delete(...entities)
		await this.refetchData()
	}

	// eslint-disable-next-line @typescript-eslint/ban-types
	private isEntityDialogClass(fn: Function): fn is Constructor<DialogEntity<TEntity>> {
		return typeof fn === 'function' && /^class\s/.test(fn.toString())
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-data-grid-entity': DataGridEntity<Entity>
	}
}