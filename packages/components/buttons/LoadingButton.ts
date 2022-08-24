import { component, css, extractEventHandler, html, nothing, property, styleMap } from '../../library'
import { Button } from '../material'
import { MaterialDialog } from '../MaterialDialog'

@component('mo-loading-button')
export class LoadingButton extends Button {
	@property({ type: Boolean }) preventClickEventInference = false
	@property({ type: Boolean, reflect: true }) loading = false

	private readonly eventHandlers = new Array<{ readonly name: string, readonly eventListener: EventListenerOrEventListenerObject }>()

	override addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
		this.eventHandlers.push({ name: type, eventListener: listener })
		super.addEventListener(type, listener, options)
	}

	override removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) {
		this.eventHandlers.forEach(({ eventListener, name }, i) => {
			if (name === type && eventListener === listener) {
				delete this.eventHandlers[i]
			}
		})
		super.removeEventListener(type, listener, options)
	}

	protected override initialized(): void {
		this.buttonElement.addEventListener('click', this.clickHandler)
	}

	static override get styles() {
		return [
			...super.styles,
			css`
				:host {
					position: relative;
				}

				:host([loading]) {
					pointer-events: none;
				}

				:host([loading]) .leading-icon {
					display: flex;
				}

				:host([loading]) .trailing-icon {
					display: flex;
				}

				:host([loading]) .mdc-button {
					color: var(--mdc-button-disabled-ink-color, rgba(0, 0, 0, 0.38));
				}

				:host([loading]) .mdc-button--raised, :host([loading]) .mdc-button--unelevated {
					background-color: var(--mdc-button-disabled-fill-color, rgba(0, 0, 0, 0.12));
				}

				:host([loading]) .mdc-button--raised {
					box-shadow: var(--mdc-button-raised-box-shadow-disabled, 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12));
				}
			`
		]
	}

	protected override renderRipple() {
		return this.loading ? nothing : super.renderRipple()
	}

	protected override render() {
		return html`
			${super.render()}
			${this.icon || this.loading === false ? nothing : this.circularProgressTemplate}
		`
	}

	protected override renderIcon() {
		return !this.loading ? super.renderIcon() : this.circularProgressTemplate
	}

	private get circularProgressTemplate() {
		const styles = {
			'--mdc-theme-primary': 'var(--mo-color-gray)',
			'margin-right': this.icon ? 'var(--mo-button-icon-margin-right, 8px)' : undefined,
			'margin-left': this.icon && this.trailingIcon ? 'var(--mo-button-icon-margin-left, 8px)' : undefined,
			'position': !this.icon ? 'absolute' : undefined,
			'left': !this.icon ? 'calc(50% - 12.5px)' : undefined,
			'top': !this.icon ? 'calc(50% - 12.5px)' : undefined,
			'width': this.icon ? '18px' : '25px',
			'height': this.icon ? '18px' : '25px',
		}
		return html`
			<mo-circular-progress indeterminate style=${styleMap(styles)}></mo-circular-progress>
		`
	}

	private readonly clickHandler = async (e: MouseEvent) => {
		if (this.preventClickEventInference === false) {
			const clickEventHandlers = this.eventHandlers
				.filter(({ name }) => name === 'click')
				.map(({ eventListener }) => extractEventHandler(eventListener))
				.map(handler => handler(e))
				.filter(Boolean)
			if (clickEventHandlers.length > 0 && this.loading === false) {
				e.stopImmediatePropagation()
				this.loading = true
				await Promise.allSettled(clickEventHandlers)
				this.loading = false
			}
		}
	}
}

MaterialDialog.executingActionAdaptersByComponent.set(LoadingButton, (button, isExecuting) => {
	(button as LoadingButton).loading = isExecuting
})

declare global {
	interface HTMLElementTagNameMap {
		'mo-loading-button': LoadingButton
	}
}