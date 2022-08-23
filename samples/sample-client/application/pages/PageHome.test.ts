import { NotificationHost } from '@3mo/model'
import { PageHome } from './PageHome'

describe('PageHome', () => {
	const fixture = setupFixture(() => new PageHome)

	it('should have been passed the default value of "sample-counter" on initialization', () => {
		const counterElement = fixture.component.renderRoot.querySelector('sample-counter')

		expect(counterElement?.count).toBe(1)
	})

	it('should show a snackbar message when the count of "sample-counter" changes', () => {
		const count = 11
		spyOn(NotificationHost.instance, 'notify')

		fixture.component.renderRoot.querySelector('sample-counter')?.countChange.dispatch(count)

		expect(NotificationHost.instance.notifyInfo).toHaveBeenCalledWith(`countChange event intercepted with the value: ${count}`)
	})
})