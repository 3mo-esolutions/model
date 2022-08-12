export const enum DialogActionKey {
	Primary = 'primary',
	Secondary = 'secondary',
	Cancellation = 'cancellation',
}

export interface Dialog {
	/** The event must be "composed", "bubbles" and "cancellable" */ readonly dialogHeadingChange: EventDispatcher<string>

	heading: string

	open: boolean

	readonly primaryActionElement: HTMLElement | undefined
	readonly secondaryActionElement: HTMLElement | undefined
	readonly cancellationActionElement: HTMLElement | undefined
	handleAction: (key: DialogActionKey) => void | Promise<void>
	executingAction?: DialogActionKey

	poppable?: boolean
	boundToWindow?: boolean
	readonly requestPopup?: EventDispatcher<void>

	manualClose?: boolean
}