import { PropertyValues } from '@a11d/lit'
import { DialogParameters } from '@a11d/lit-application'
import { Entity } from '.'
import { EntityDialog } from './EntityDialog'
import { FetchableDialogComponent } from './FetchableDialogComponent'

export abstract class EntityDialogComponent<TEntity, TParameters extends Exclude<DialogParameters, void> = Entity, TResult = TEntity> extends FetchableDialogComponent<TEntity, TParameters, TResult | undefined> {
	protected abstract save(entity: TEntity): (TEntity | void) | PromiseLike<TEntity | void>
	protected abstract delete?(entity: TEntity): void | PromiseLike<void>

	override get dialogElement() {
		if (super.dialogElement instanceof EntityDialog === false) {
			throw new Error('EntityDialogComponent must be used with an mo-entity-dialog element or a subclass thereof')
		}
		return super.dialogElement as EntityDialog<TEntity>
	}

	protected override firstUpdated(props: PropertyValues) {
		super.firstUpdated(props)
		this.dialogElement.save = () => this.save(this.entity)
		if (this.delete) {
			this.dialogElement.delete = () => this.delete?.(this.entity)
		}
	}

	protected override async primaryAction() {
		return (await this.save(this.entity) || undefined) as TResult | undefined
	}

	protected override async secondaryAction() {
		if (this.parameters.id === undefined) {
			throw new Error('Cannot delete a new entity')
		}
		await this.delete?.(this.entity)
		return undefined
	}
}