import { LitElement } from '@a11d/lit'

export const enum DialogActionKey {
	Primary = 'primary',
	Secondary = 'secondary',
	Cancellation = 'cancellation',
}

export function isDialogActionKey(value: unknown): value is DialogActionKey {
	return typeof value === 'string'
		&& [DialogActionKey.Primary, DialogActionKey.Secondary, DialogActionKey.Cancellation].includes(value as DialogActionKey)
}

export interface Dialog extends LitElement {
	/** The event must be "composed", "bubbles" and "cancellable" */
	readonly dialogHeadingChange: EventDispatcher<string>

	heading: string

	open: boolean

	readonly primaryActionElement: HTMLElement | undefined
	readonly secondaryActionElement: HTMLElement | undefined
	readonly cancellationActionElement: HTMLElement | undefined
	preventCancellationOnEscape?: boolean
	handleAction: (key: DialogActionKey) => void | Promise<void>
	primaryOnEnter?: boolean
	executingAction?: DialogActionKey

	poppable?: boolean
	boundToWindow?: boolean
	readonly requestPopup?: EventDispatcher<void>

	/** Indicated whether dialog is automatically closed after **non-cancellation** actions */
	manualClose?: boolean
}