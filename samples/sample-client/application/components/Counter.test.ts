import { Flex } from '@3mo/model'
import { Counter } from './Counter'

describe('CounterButton', () => {
	const fixture = setupFixture(() => new Counter)

	it('should change button inner text when count is changed', async () => {
		const count = 11

		fixture.component.count = count
		await fixture.component.updateComplete

		expect(fixture.component.renderRoot.querySelector<Flex>('mo-flex[data-test-id=count]')?.innerText).toBe('11')
	})

	it('should increment "count" property when increment button in clicked', () => {
		const count = fixture.component.count

		fixture.component.renderRoot.querySelectorAll('mo-button')[1].click()

		expect(fixture.component.count).toBe(count + 1)
	})

	it('should dispatch "counterChange" event with decreased count when decrease button in clicked', () => {
		const count = fixture.component.count
		spyOn(fixture.component.countChange, 'dispatch')

		fixture.component.renderRoot.querySelectorAll('mo-button')[0].click()

		expect(fixture.component.countChange.dispatch).toHaveBeenCalledWith(count - 1)
	})

	it('should dispatch "counterChange" event with increased count when increase button in clicked', () => {
		const count = fixture.component.count
		spyOn(fixture.component.countChange, 'dispatch')

		fixture.component.renderRoot.querySelectorAll('mo-button')[1].click()

		expect(fixture.component.countChange.dispatch).toHaveBeenCalledWith(count + 1)
	})
})