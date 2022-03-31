import { DialogAlert } from './DialogAlert'

describe(DialogAlert.name, () => {
	let dialog: DialogAlert
	beforeEach(async () => dialog = await initializeTestComponent(new DialogAlert(parameters)))
	afterEach(() => dialog.remove())

	const parameters: DialogAlert['parameters'] = {
		heading: 'Heading',
		content: 'Content',
		primaryButtonText: 'Primary Button',
		blocking: true,
		size: 'medium'
	}

	it('should have used parameters to customize dialog', () => {
		expect(dialog.dialogElement?.heading).toBe(parameters.heading)
		expect(dialog.dialogElement?.innerText).toBe(parameters.content as string)
		expect(dialog.dialogElement?.primaryButtonText).toBe(parameters.primaryButtonText)
		expect(dialog.dialogElement?.blocking).toBe(parameters.blocking)
		expect(dialog.dialogElement?.size).toBe(parameters.size)
	})

	it('should not have secondary button', () => {
		expect(dialog.secondaryButton).toBeNull()
	})

	it('should return "true" if primary button is clicked', async () => {
		const confirmationPromise = dialog.confirm()
		dialog.primaryButton?.click()
		await expectAsync(confirmationPromise).toBeResolved()
	})
})