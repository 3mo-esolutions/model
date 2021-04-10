import { Snackbar } from '@3mo/model/library'
import { PageHome } from './PageHome'

describe('PageHome', () => {
	let page: PageHome
	beforeEach(async () => page = await initializeTestComponent(new PageHome))
	afterEach(() => page.remove())

	it('should have been passed the default value of "sample-counter-button" on initialization', () => {
		const counterElement = page.shadowRoot.querySelector('sample-counter-button')

		expect(counterElement?.count).toBe(1)
	})

	it('should show a snackbar message when the count of "sample-counter-button" changes', () => {
		const count = 11
		spyOn(Snackbar, 'show')

		page.shadowRoot.querySelector('sample-counter-button')?.countChange.dispatch(count)

		expect(Snackbar.show).toHaveBeenCalledWith(`countChange event intercepted with the value: ${count}`)
	})
})