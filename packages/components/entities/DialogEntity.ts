/* eslint-disable @typescript-eslint/member-ordering */
import { html, PropertyValues, state } from '@a11d/lit'
import { DialogComponent, DialogParameters } from '@a11d/lit-application'
import { TemplateHelper } from '../../library'
import { Entity, EntityId } from '.'

export abstract class DialogEntity<TEntity, T extends Exclude<DialogParameters, void> = Entity> extends DialogComponent<T, TEntity | undefined> {
	protected abstract fetch(id: EntityId): TEntity | PromiseLike<TEntity>
	protected abstract save(entity: TEntity): (TEntity | void) | PromiseLike<TEntity | void>
	protected abstract delete?(entity: TEntity): void | PromiseLike<void>
	@state() protected abstract entity: TEntity

	protected override async firstUpdated(props: PropertyValues) {
		super.firstUpdated(props)
		this.renderPrimaryButton()
		if (this.parameters.id) {
			if (this.delete) {
				this.renderDeleteButton()
			}
			await this.fetchEntity()
		}
	}

	private renderPrimaryButton() {
		const buttonTemplate = html`<mo-loading-button slot='primaryAction' type='raised'>Speichern</mo-loading-button>`
		const button = TemplateHelper.extractBySelector(buttonTemplate, 'mo-loading-button')
		this.dialogElement.insertBefore(button, this.dialogElement.firstElementChild)
	}

	private renderDeleteButton() {
		const buttonTemplate = html`<mo-loading-button slot='secondaryAction' type='outlined' style='--mdc-theme-primary: var(--mo-color-error);'>Delete</mo-loading-button>`
		const button = TemplateHelper.extractBySelector(buttonTemplate, 'mo-loading-button')
		this.dialogElement.insertBefore(button, this.dialogElement.firstElementChild)
	}

	protected async fetchEntity() {
		if (this.parameters.id) {
			this.entity = await this.fetch(this.parameters.id)
		}
	}

	protected override async primaryAction() {
		return await this.save(this.entity) || undefined
	}

	protected override secondaryAction = async () => {
		if (this.parameters.id === undefined) {
			throw new Error('Cannot delete a new entity')
		}
		await this.delete?.(this.entity)
		return undefined
	}
}