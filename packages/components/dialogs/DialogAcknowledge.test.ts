import { MaterialDialog, MaterialDialogSize } from '../MaterialDialog'
import { DialogAcknowledge } from './DialogAcknowledge'

describe(DialogAcknowledge.name, () => {
	const fixture = setupFixture(() => new DialogAcknowledge(parameters))

	const parameters: DialogAcknowledge['parameters'] = {
		heading: 'Heading',
		content: 'Content',
		primaryButtonText: 'Primary Button',
		blocking: true,
		size: MaterialDialogSize.Medium,
		secondaryButtonText: 'Secondary Button'
	}

	it('should have used parameters to customize dialog', () => {
		expect(fixture.component.dialogElement.heading).toBe(parameters.heading)
		expect(fixture.component.dialogElement.innerText).toBe(parameters.content as string)
		expect((fixture.component.dialogElement as MaterialDialog).primaryButtonText).toBe(parameters.primaryButtonText!)
		expect((fixture.component.dialogElement as MaterialDialog).blocking).toBe(parameters.blocking!)
		expect((fixture.component.dialogElement as MaterialDialog).size).toBe(parameters.size!)
		expect((fixture.component.dialogElement as MaterialDialog).secondaryButtonText).toBe(parameters.secondaryButtonText)
	})

	it('should return "true" if primary button is clicked', async () => {
		const confirmationPromise = fixture.component.confirm()
		fixture.component.primaryActionElement?.click()
		await expectAsync(confirmationPromise).toBeResolvedTo(true)
	})

	it('should return "false" if secondary button is clicked', async () => {
		const confirmationPromise = fixture.component.confirm()
		fixture.component.secondaryActionElement?.click()
		await expectAsync(confirmationPromise).toBeResolvedTo(false)
	})
})