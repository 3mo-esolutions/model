import { html, render } from '../../library'
import { Card } from './Card'

describe(Card.name, () => {
	let card: Card
	beforeEach(async () => card = await initializeTestComponent(new Card))
	afterEach(() => card.remove())

	function testSlotRendersIfContentAvailable(toBeRenderSlotName: string, contentSlotName: string) {
		it(`should render slot "${toBeRenderSlotName}" if the content of slot "${contentSlotName}" is available`, async () => {
			render(html`<mo-div slot=${contentSlotName}>Content</mo-div>`, card)

			card.requestUpdate()
			await card.updateComplete

			expect(card.renderRoot.querySelector(`slot[part=${toBeRenderSlotName}]`)).not.toBeNull()
		})
	}

	function testSlotRendersIfPropertyIsSet(toBeRenderSlotName: string, property: keyof Card) {
		it(`should render slot "${toBeRenderSlotName}" if property "${property}" is set`, async () => {
			// @ts-expect-error - property is writable
			card[property] = 'test'

			await card.updateComplete

			expect(card.renderRoot.querySelector(`slot[part=${toBeRenderSlotName}]`)).not.toBeNull()
		})
	}

	describe('Header', () => {
		for (const property of ['heading', 'avatar', 'subHeading'] as const) {
			testSlotRendersIfPropertyIsSet('header', property)
		}

		for (const slotName of ['header', 'avatar', 'heading', 'subHeading', 'action'] as const) {
			testSlotRendersIfContentAvailable('header', slotName)
		}

		for (const [propertyName, elementSelector] of [['avatar', 'mo-avatar'], ['heading', 'mo-heading[part=heading]'], ['subHeading', 'mo-heading[part=subHeading]']] as const) {
			it(`should render the ${elementSelector} element if ${propertyName} is set`, async () => {
				const content = 'Content'

				card[propertyName] = content
				await card.updateComplete

				expect(card.renderRoot.querySelector(elementSelector)).not.toBeNull()
				expect(card.renderRoot.querySelector(elementSelector)?.textContent).toBe(content)
			})
		}
	})

	describe('Media', () => {
		testSlotRendersIfContentAvailable('media', 'media')

		testSlotRendersIfPropertyIsSet('media', 'image')

		it('should set the source of the image element when "image" property is set', async () => {
			card.image = 'https://example.com/image.jpg'

			await card.updateComplete

			expect(card.renderRoot.querySelector('img')?.src).toBe(card.image)
		})
	})

	describe('Footer', () => {
		testSlotRendersIfContentAvailable('footer', 'footer')
	})
})