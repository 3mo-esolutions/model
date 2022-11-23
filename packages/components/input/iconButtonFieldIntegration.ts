import { css } from '@a11d/lit'
import { IconButton } from '..'
import { Field } from './Field'

export const iconButtonFieldIntegration = {
	styles: css`
		[data-leading-icon-button], ::slotted([data-leading-icon-button]) {
			margin-inline-start: -8px;
		}

		[data-trailing-icon-button], ::slotted([data-trailing-icon-button]) {
			margin-inline-end: -8px;
		}
	`,
	async slotChangedHandler<T>(this: Field<T>) {
		await this.updateComplete
		const elements = [...this.renderRoot.querySelectorAll('*')]
		const leadingSlotIndex = elements.findIndex(e => e === this.renderRoot.querySelector('slot[name=leading]'))
		const trailingSlotIndex = elements.findIndex(e => e === this.renderRoot.querySelector('slot[name=trailing]'))

		const firstIconButton = this.renderRoot.querySelector('mo-icon-button:first-of-type')
		const lastIconButton = this.renderRoot.querySelector('mo-icon-button:last-of-type')

		const leadingIconButtons = [
			!firstIconButton ? undefined : elements.indexOf(firstIconButton) < leadingSlotIndex ? firstIconButton : undefined,
			...this.slotController.getAssignedElements('leading').filter(e => e instanceof IconButton)
		].filter(Boolean) as Array<HTMLElement>

		const trailingIconButtons = [
			...this.slotController.getAssignedElements('trailing').filter(e => e instanceof IconButton),
			!lastIconButton ? undefined : elements.indexOf(lastIconButton) > trailingSlotIndex ? lastIconButton : undefined
		].filter(Boolean) as Array<HTMLElement>

		leadingIconButtons.forEach((iconButton, index) => iconButton.switchAttribute('data-leading-icon-button', index === 0))
		trailingIconButtons.forEach((iconButton, index) => iconButton.switchAttribute('data-trailing-icon-button', index === trailingIconButtons.length - 1))
	}
}

Field.slotIntegrations.add(iconButtonFieldIntegration)