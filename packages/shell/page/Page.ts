import { LitElement } from '@a11d/lit'

export interface Page extends LitElement {
	/** The event must have all "composed", "bubbles" and "cancellable" options */
	readonly pageHeadingChange: EventDispatcher<string>
}