import { LitElement } from '@a11d/lit'

export interface Page extends LitElement {
	/** The event must be "composed", "bubbles" and "cancellable" */
	readonly pageHeadingChange: EventDispatcher<string>
}