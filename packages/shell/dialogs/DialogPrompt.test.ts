import { DialogPrompt } from './DialogPrompt'

describe(DialogPrompt.name, () => {
	let dialog: DialogPrompt
	beforeEach(async () => dialog = await initializeTestComponent(new DialogPrompt(parameters)))
	afterEach(() => dialog.remove())

	const parameters: DialogPrompt['parameters'] = {
		heading: 'Heading',
		content: 'Content',
		primaryButtonText: 'Primary Button',
		blocking: true,
		size: 'large',
		value: 'Initial value',
	}

	it('should set "primaryOnEnter" dialog property to true', () => {
		expect(dialog.dialogElement?.primaryOnEnter).toBe(true)
	})

	it('should not have secondary button', () => {
		expect(dialog.secondaryButton).toBeNull()
	})

	it('should have used parameters to customize dialog', () => {
		expect(dialog.dialogElement?.heading).toBe(parameters.heading)
		expect(dialog.dialogElement?.innerText).toBe(parameters.content as string)
		expect(dialog.dialogElement?.primaryButtonText).toBe(parameters.primaryButtonText)
		expect(dialog.dialogElement?.blocking).toBe(parameters.blocking)
		expect(dialog.dialogElement?.size).toBe(parameters.size)
	})

	const parametersVariations: Array<DialogPrompt['parameters']> = [
		{
			...parameters,
			inputLabel: undefined,
			isTextArea: false
		},
		{
			...parameters,
			inputLabel: 'Input Label',
			isTextArea: false,
		},
		{
			...parameters,
			inputLabel: undefined,
			isTextArea: true
		},
		{
			...parameters,
			inputLabel: 'Input Label',
			isTextArea: true
		},
	]

	for (const parameters of parametersVariations) {
		describe(`when ["isTextArea" is "${parameters.isTextArea}"] and ["inputLabel" is "${parameters.inputLabel}"]`, () => {
			let dialog: DialogPrompt
			beforeEach(async () => dialog = await initializeTestComponent(new DialogPrompt(parameters)))
			afterEach(() => dialog.remove())

			it('should set the label of the input element', () => {
				expect(dialog.inputElement.label).toBe(parameters.inputLabel ?? 'Input')
			})

			it('should set the initial value of the input element', () => {
				expect(dialog.inputElement.value).toBe(parameters.value)
			})

			it('should return the value of the input element when the primary button is clicked', () => {
				expect(dialog.inputElement.value).toBe(parameters.value)
			})
		})
	}
})