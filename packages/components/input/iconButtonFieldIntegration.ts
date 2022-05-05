import { css } from '../../library'
// eslint-disable-next-line import/no-internal-modules
import { IconButton } from '../material/IconButton'
import { Field } from './Field'

export const iconButtonFieldIntegration = {
	styles: css`
		[data-leading-icon-button], ::slotted([data-leading-icon-button]) {
			margin-left: -8px;
		}

		[data-trailing-icon-button], ::slotted([data-trailing-icon-button]) {
			margin-right: -8px;
		}
	`,
	async slotChangedHandler<T>(this: Field<T>) {
		await this.updateComplete
		const elements = [...this.shadowRoot.querySelectorAll('*')]
		const leadingSlotIndex = elements.findIndex(e => e === this.shadowRoot.querySelector('slot[name=leading]'))
		const trailingSlotIndex = elements.findIndex(e => e === this.shadowRoot.querySelector('slot[name=trailing]'))

		const firstIconButton = this.shadowRoot.querySelector('mo-icon-button:first-of-type')
		const lastIconButton = this.shadowRoot.querySelector('mo-icon-button:last-of-type')

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