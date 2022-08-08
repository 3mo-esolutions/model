import { DialogDefault } from './DialogDefault'

describe(DialogDefault.name, () => {
	let dialog: DialogDefault<string>
	beforeEach(async () => dialog = await initializeTestComponent(new DialogDefault(parameters)))
	afterEach(() => dialog.remove())

	const parameters: DialogDefault<string>['parameters'] = {
		heading: 'Heading',
		content: 'Content',
		blocking: true,
		size: 'medium',
		primaryButtonText: 'Primary Button',
		primaryAction: jasmine.createSpy('primaryAction').and.returnValue('Primary Button Clicked!'),
		secondaryButtonText: 'Secondary Button',
		secondaryAction: jasmine.createSpy('secondaryAction').and.returnValue('Secondary Button Clicked!'),
	}

	it('should set "primaryOnEnter" dialog property to true', () => {
		expect(dialog.dialogElement.primaryOnEnter).toBe(true)
	})

	it('should have used parameters to customize dialog', () => {
		expect(dialog.dialogElement.heading).toBe(parameters.heading)
		expect(dialog.dialogElement.innerText).toBe(parameters.content as string)
		expect(dialog.dialogElement.primaryButtonText).toBe(parameters.primaryButtonText!)
		expect(dialog.dialogElement.secondaryButtonText).toBe(parameters.secondaryButtonText)
		expect(dialog.dialogElement.blocking).toBe(parameters.blocking!)
		expect(dialog.dialogElement.size).toBe(parameters.size!)
	})

	it('should call "primaryAction" parameter and return its value when the primary button is clicked', async () => {
		const confirmationPromise = dialog.confirm()
		dialog.primaryButton?.click()
		expect(parameters.primaryAction).toHaveBeenCalledOnceWith()
		await expectAsync(confirmationPromise).toBeResolvedTo('Primary Button Clicked!')
	})

	it('should call "secondaryAction" parameter and return its value when the secondary button is clicked', async () => {
		const confirmationPromise = dialog.confirm()
		dialog.secondaryButton?.click()
		expect(parameters.secondaryAction).toHaveBeenCalledOnceWith()
		await expectAsync(confirmationPromise).toBeResolvedTo('Secondary Button Clicked!')
	})
})