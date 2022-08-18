import { directive, Directive, ElementPart, PartInfo, PartType } from '../../library'

export const observeResize = directive(class extends Directive {
	private readonly observer = new ResizeObserver((...args) => this.callback?.(...args))
	private readonly element: Element
	private callback?: ResizeObserverCallback

	constructor(partInfo: PartInfo) {
		super(partInfo)

		if (partInfo.type !== PartType.ELEMENT) {
			throw new Error('observeResize can only be used on an element')
		}

		const part = partInfo as ElementPart
		this.element = part.element
	}

	render(callback: ResizeObserverCallback, options?: ResizeObserverOptions) {
		this.callback = callback
		this.observer.observe(this.element, options)
	}
})