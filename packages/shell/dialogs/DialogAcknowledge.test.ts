import { DialogAcknowledge } from './DialogAcknowledge'

describe(DialogAcknowledge.name, () => {
	let dialog: DialogAcknowledge
	beforeEach(async () => dialog = await initializeTestComponent(new DialogAcknowledge(parameters)))
	afterEach(() => dialog.remove())

	const parameters: DialogAcknowledge['parameters'] = {
		heading: 'Heading',
		content: 'Content',
		primaryButtonText: 'Primary Button',
		blocking: true,
		size: 'medium',
		secondaryButtonText: 'Secondary Button'
	}

	it('should have used parameters to customize dialog', () => {
		expect(dialog.dialogElement.heading).toBe(parameters.heading)
		expect(dialog.dialogElement.innerText).toBe(parameters.content as string)
		expect(dialog.dialogElement.primaryButtonText).toBe(parameters.primaryButtonText!)
		expect(dialog.dialogElement.blocking).toBe(parameters.blocking!)
		expect(dialog.dialogElement.size).toBe(parameters.size!)
		expect(dialog.dialogElement.secondaryButtonText).toBe(parameters.secondaryButtonText)
	})

	it('should return "true" if primary button is clicked', async () => {
		const confirmationPromise = dialog.confirm()
		dialog.primaryButton?.click()
		await expectAsync(confirmationPromise).toBeResolvedTo(true)
	})

	it('should return "false" if secondary button is clicked', async () => {
		const confirmationPromise = dialog.confirm()
		dialog.secondaryButton?.click()
		await expectAsync(confirmationPromise).toBeResolvedTo(false)
	})
})