import { IStyledElement } from './IStyledElement'
import { ComponentConstructor } from './Component'

export interface IComponent extends IStyledElement {
	['constructor']: ComponentConstructor
	readonly shadowRoot: ShadowRoot
	readonly parentElement: HTMLElement
	readonly childElements: Array<HTMLElement>
	readonly isFirstChild: boolean
	removeChildren(): void
}