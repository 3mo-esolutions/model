import { MaterialDialog, MaterialDialogSize } from '../MaterialDialog'
import { DialogAlert } from './DialogAlert'

describe(DialogAlert.name, () => {
	const fixture = setupFixture(() => new DialogAlert(parameters))

	const parameters: DialogAlert['parameters'] = {
		heading: 'Heading',
		content: 'Content',
		primaryButtonText: 'Primary Button',
		blocking: true,
		size: MaterialDialogSize.Medium,
	}

	it('should have used parameters to customize dialog', () => {
		expect(fixture.component.dialogElement.heading).toBe(parameters.heading)
		expect(fixture.component.dialogElement.innerText).toBe(parameters.content as string)
		expect((fixture.component.dialogElement as MaterialDialog).primaryButtonText).toBe(parameters.primaryButtonText!)
		expect((fixture.component.dialogElement as MaterialDialog).blocking).toBe(parameters.blocking!)
		expect((fixture.component.dialogElement as MaterialDialog).size).toBe(parameters.size!)
	})

	it('should not have secondary button', () => {
		expect(fixture.component.secondaryActionElement).toBeUndefined()
	})

	it('should return "true" if primary button is clicked', async () => {
		const confirmationPromise = fixture.component.confirm()
		fixture.component.primaryActionElement?.click()
		await expectAsync(confirmationPromise).toBeResolved()
	})
})