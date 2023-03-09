import { PropertyValues, state } from '@a11d/lit'
import { DialogComponent, DialogParameters } from '@a11d/lit-application'
import { Entity, EntityId } from '.'
import { FetchableDialog } from './FetchableDialog'

export abstract class FetchableDialogComponent<TEntity, TParameters extends Exclude<DialogParameters, void> = Entity, TResult = void> extends DialogComponent<TParameters, TResult> {
	@state() protected abstract entity: TEntity
	protected abstract fetch(id: EntityId): TEntity | PromiseLike<TEntity>

	get fetcherController() { return this.dialogElement.fetcherController }

	// @ts-expect-error Property stays readonly
	override get dialogElement() {
		if (super.dialogElement instanceof FetchableDialog === false) {
			throw new Error('FetchableDialogComponent must be used with an mo-fetchable-dialog element or a subclass thereof')
		}
		return super.dialogElement as FetchableDialog<TEntity>
	}

	protected override firstUpdated(props: PropertyValues) {
		super.firstUpdated(props)
		this.dialogElement.fetch = () => !this.parameters.id ? this.entity : this.fetch(this.parameters.id)
	}

	override async connectedCallback() {
		await super.connectedCallback()
		this.dialogElement.fetcherController.fetched.subscribe(this.handleFetched)
	}

	override disconnectedCallback() {
		super.disconnectedCallback()
		this.dialogElement.fetcherController.fetched.unsubscribe(this.handleFetched)
	}

	private handleFetched = (entity: TEntity) => {
		this.entity = entity
	}
}