import { Component, component, event, html, property, query } from '../../library'
import { NotificationHost } from '../../shell'

/**
 * @fires change {CustomEvent<TResult | undefined>}
 * @fires uploading {CustomEvent}
 * @fires upload {CustomEvent<TResult>}
 */
@component('mo-upload')
export abstract class Upload<TResult> extends Component {
	@event() readonly change!: EventDispatcher<string | undefined>
	@event() readonly uploading!: EventDispatcher
	@event() readonly upload!: EventDispatcher<TResult>

	@property({ type: Boolean }) uploadOnSelection = false

	@query('input') private readonly inputElement!: HTMLInputElement

	get file() { return this.inputElement.files?.[0] }

	abstract uploadFile(): TResult | Promise<TResult>

	openExplorer() {
		this.inputElement.click()
	}

	async uploadSelectedFile(file = this.file) {
		if (!file) {
			return
		}

		try {
			this.uploading.dispatch()
			const result = await this.uploadFile()
			this.upload.dispatch(result)
			this.inputElement.value = ''
			this.change.dispatch(undefined)
		} catch (error) {
			NotificationHost.instance.notifyError('Upload ist fehlgeschlagen. Versuche erneut.')
		}
	}

	protected override get template() {
		return html`
			<input type='file' style='display: none' @change=${this.handleChange}>
		`
	}

	protected handleChange = () => {
		this.change.dispatch(this.file?.name)
		if (this.uploadOnSelection) {
			this.uploadSelectedFile()
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-upload': Upload<unknown>
	}
}