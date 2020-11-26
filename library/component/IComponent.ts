import { IStyledElement } from './IStyledElement'

export default interface IComponent extends IStyledElement {
	readonly shadowRoot: ShadowRoot
	readonly parentElement: HTMLElement
	readonly childElements: Array<HTMLElement>
	readonly isFirstChild: boolean
	removeChildren(): void
}