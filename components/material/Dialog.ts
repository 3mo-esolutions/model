import { component, property, query, componentize, Snackbar } from '../../library'
import { Dialog as MwcDialog } from '@material/mwc-dialog'
import { Button, IconButton } from '.'
import * as CSS from 'csstype'

type DialogSize = 'large' | 'medium' | 'small'

/**
 * @attr hideActions
 * @attr defaultAction
 * @attr actionAttribute
 * @attr initialFocusAttribute
 * @cssprop --mdc-dialog-scrim-color
 * @cssprop --mdc-dialog-heading-ink-color
 * @cssprop --mdc-dialog-content-ink-color
 * @cssprop --mdc-dialog-scroll-divider-color
 * @cssprop --mdc-dialog-min-width
 * @cssprop --mdc-dialog-max-width
 * @cssprop --mdc-dialog-max-height
 * @cssprop --mdc-dialog-box-shadow
 */
@component('mdc-dialog')
export default class Dialog extends componentize(MwcDialog) {
	@eventProperty readonly finished!: IEvent<boolean>
	primaryButtonClicked: () => Promise<any> | any = () => void 0

	constructor() {
		super()

		if (!this.primaryElement) {
			this.btnPrimaryDefault = new Button()
			this.btnPrimaryDefault.slot = 'primaryAction'
			this.btnPrimaryDefault.innerText = 'OK'
			this.appendChild(this.btnPrimaryDefault)
		}

		if (!this.secondaryElement) {
			this.btnSecondaryDefault = new Button()
			this.btnSecondaryDefault.slot = 'secondaryAction'
			this.btnSecondaryDefault.innerText = 'Cancel'
			this.appendChild(this.btnSecondaryDefault)
		}

		this.icbClose = new IconButton
		this.icbClose.icon = 'close'
		this.icbClose.onclick = () => this.handleSecondaryButtonClick()
		this.icbClose.position = 'absolute'
		this.icbClose.style.right = '8px'
		this.icbClose.style.top = '8px'
	}

	private btnPrimaryDefault?: Button
	private btnSecondaryDefault?: Button
	private icbClose: IconButton

	@property()
	get header() { return this.heading }
	set header(value) { this.heading = value }

	@property({ type: Boolean })
	get isBlocking() { return this.scrimClickAction !== 'close' }
	set isBlocking(value) {
		this.scrimClickAction = value ? '' : 'close'
		this.escapeKeyAction = value ? '' : 'close'
		this.secondaryElement.hidden = value
		this.icbClose.hidden = value
	}

	private _size: DialogSize = 'small'
	@property()
	get size() { return this._size }
	set size(value) {
		switch (value) {
			case 'large':
				this.style.setProperty('--mdc-dialog-max-width', 'calc(100% - 32px)')
				break
			case 'medium':
				this.style.setProperty('--mdc-dialog-max-width', 'var(--mdc-min-width)')
				break
			case 'small':
				this.style.setProperty('--mdc-dialog-max-width', '560px')
				break
		}
	}

	@property()
	get primaryButtonText() { return this.btnPrimaryDefault?.innerText ?? this.primaryElement.innerText }
	set primaryButtonText(value) {
		if (this.btnPrimaryDefault) {
			this.btnPrimaryDefault.innerText = value
		}
	}

	@property()
	get secondaryButtonText() { return this.btnSecondaryDefault?.innerText ?? this.secondaryElement.innerText }
	set secondaryButtonText(value) {
		if (this.btnSecondaryDefault) {
			this.secondaryElement.innerText = value
		}
	}

	@property() actionsJustifyContent: CSS.Property.JustifyContent = 'flex-end'

	protected get primaryElement() {
		return this.querySelector('[slot="primaryAction"]') as unknown as HTMLElement
	}

	protected get secondaryElement() {
		return this.querySelector('[slot="secondaryAction"]') as unknown as HTMLElement
	}

	@query('.mdc-dialog__surface') private readonly divSurface!: HTMLDivElement
	@query('#actions') private readonly actionsElement!: HTMLDivElement

	protected initialized() {
		this.divSurface.appendChild(this.icbClose)
		this.actionsElement.style.justifyContent = this.actionsJustifyContent
		this.primaryElement.addEventListener('click', this.handlePrimaryButtonClick.bind(this))
		this.secondaryElement.addEventListener('click', this.handleSecondaryButtonClick.bind(this))
		this.addEventListener('closed', (e: CustomEvent<{ action: 'close' | undefined }>) => {
			if (e.detail.action === 'close') {
				this.handleSecondaryButtonClick()
			}
		})

		// To prevent the default behavior of executing primaryAction when Enter key is pressed
		this.mdcRoot.onkeydown = e => e.stopImmediatePropagation()
	}

	private async handlePrimaryButtonClick() {
		try {
			await this.primaryButtonClicked()
			this.close()
			this.finished.trigger(true)
		} catch (e) {
			Snackbar.show(e.message)
			throw e
		}
	}

	private handleSecondaryButtonClick() {
		this.close()
		this.finished.trigger(false)
	}
}