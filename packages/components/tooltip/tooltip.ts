import { ReactiveController } from 'lit'
import { directive, Directive, ElementPart, HTMLTemplateResult, PartInfo, PartType, ReactiveControllerHost, render } from '@a11d/lit'
import { Tooltip, TooltipPosition } from './TooltipHost'

export const tooltip = directive(class extends Directive {
	private readonly tooltip?: Tooltip
	private readonly element: Element

	constructor(partInfo: PartInfo) {
		super(partInfo)

		if (partInfo.type !== PartType.ELEMENT) {
			throw new Error('tooltip can only be used on an element')
		}

		const part = partInfo as ElementPart
		this.element = part.element

		this.tooltip ??= new Tooltip(this.element)
	}

	async render(host: ReactiveControllerHost, content: string | HTMLTemplateResult, position?: TooltipPosition) {
		if (typeof content === 'string') {
			this.element.ariaLabel = content
		}

		render(content, this.tooltip!)

		if (position) {
			this.tooltip!.position = position
		}

		await host.updateComplete
		host.addController(new TooltipController(this.tooltip!))
	}
})

class TooltipController implements ReactiveController {
	constructor(protected readonly tooltip: Tooltip) { }

	hostConnected() {
		MoDeL.application.renderRoot.appendChild(this.tooltip)
	}

	hostDisconnected() {
		this.tooltip.remove()
	}
}