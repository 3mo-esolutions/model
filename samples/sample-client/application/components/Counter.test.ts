import { Flex } from '@3mo/model'
import { Counter } from './Counter'

describe('CounterButton', () => {
	let component: Counter
	beforeEach(async () => component = await initializeTestComponent(new Counter))
	afterEach(() => component.remove())

	it('should change button inner text when count is changed', async () => {
		const count = 11

		component.count = count
		await component.updateComplete

		expect(component.shadowRoot.querySelector<Flex>('mo-flex[data-test-id=count]')?.innerText).toBe('11')
	})

	it('should increment "count" property when increment button in clicked', () => {
		const count = component.count

		component.shadowRoot.querySelectorAll('mo-button')[1].click()

		expect(component.count).toBe(count + 1)
	})

	it('should dispatch "counterChange" event with decreased count when decrease button in clicked', () => {
		const count = component.count
		spyOn(component.countChange, 'dispatch')

		component.shadowRoot.querySelectorAll('mo-button')[0].click()

		expect(component.countChange.dispatch).toHaveBeenCalledWith(count - 1)
	})

	it('should dispatch "counterChange" event with increased count when increase button in clicked', () => {
		const count = component.count
		spyOn(component.countChange, 'dispatch')

		component.shadowRoot.querySelectorAll('mo-button')[1].click()

		expect(component.countChange.dispatch).toHaveBeenCalledWith(count + 1)
	})
})