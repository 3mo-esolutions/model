import { CounterButton } from './CounterButton'

describe('CounterButton', () => {
	let button: CounterButton
	beforeEach(async () => button = await initializeTestComponent(new CounterButton))
	afterEach(() => button.remove())

	it('should change button inner text when count is changed', async () => {
		const count = 11

		button.count = count
		await button.updateComplete

		expect(button.shadowRoot.querySelector('mo-button')?.innerText).toBe('➕ INCREASE - 11')
	})

	it('should increment "count" property when button in clicked', () => {
		const count = button.count

		button.shadowRoot.querySelector('mo-button')?.click()

		expect(button.count).toBe(count + 1)
	})

	it('should dispatch "counterChange" event when button in clicked', () => {
		const count = button.count
		spyOn(button.countChange, 'dispatch')

		button.shadowRoot.querySelector('mo-button')?.click()

		expect(button.countChange.dispatch).toHaveBeenCalledWith(count + 1)
	})
})