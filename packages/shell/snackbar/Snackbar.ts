import { component, html, css, ComponentMixin, renderContainer, property, eventListener, ifDefined, nothing } from '../../library'
import { MaterialIcon } from '../../components'
import { nonInertable } from '..'
import { PeriodicTimer } from '../../utilities'
import { Snackbar as MwcSnackbar } from '@material/mwc-snackbar'

export const enum SnackbarType {
	Info = 'info',
	Success = 'success',
	Warning = 'warning',
	Error = 'error',
}

/**
 * @attr stacked
 * @attr leading
 * @fires MDCSnackbar:opening {CustomEvent}
 * @fires MDCSnackbar:opened {CustomEvent}
 * @fires MDCSnackbar:closing {CustomEvent<{ reason?: string }>}
 * @fires MDCSnackbar:closed {CustomEvent<{ reason?: string }>}
 * @cssprop --mdc-snackbar-action-color
 */
@component('mo-snackbar')
@nonInertable()
export class Snackbar extends ComponentMixin(MwcSnackbar) {
	private static readonly defaultTimerPeriod = TimeSpan.fromMilliseconds(5000)

	private static readonly iconByType = new Map<SnackbarType, MaterialIcon>([
		[SnackbarType.Info, 'info'],
		[SnackbarType.Success, 'check_circle'],
		[SnackbarType.Warning, 'warning'],
		[SnackbarType.Error, 'error'],
	])

	private static readonly durationsByType = new Map<SnackbarType, number>([
		[SnackbarType.Info, 5_000],
		[SnackbarType.Success, 5_000],
		[SnackbarType.Warning, 10_000],
		[SnackbarType.Error, 15_000],
	])

	static show(...parameters: Parameters<typeof MoDeL.application.snackbarHost.show>) {
		return MoDeL.application.snackbarHost.show(...parameters)
	}

	static override get styles() {
		return [
			...super.styles,
			css`
				:host {
					--mo-snackbar-success-color-base : 93, 170, 96;
					--mo-snackbar-warning-color-base: 232, 152, 35;
					--mo-snackbar-error-color-base: 221, 61, 49;
					--mo-snackbar-info-color-base: 0, 119, 200;
					width: 100%;
				}

				:host([type=success]) {
					--mo-snackbar-color-base: var(--mo-snackbar-success-color-base);
				}

				:host([type=warning]) {
					--mo-snackbar-color-base: var(--mo-snackbar-warning-color-base);
				}

				:host([type=error]) {
					--mo-snackbar-color-base: var(--mo-snackbar-error-color-base);
				}

				:host([type=info]) {
					--mo-snackbar-color-base: var(--mo-snackbar-info-color-base);
				}

				.mdc-snackbar {
					position: var(--mo-snackbar-position, fixed);
				}

				.mdc-snackbar__surface {
					background-color: var(--mo-color-foreground);
				}

				.mdc-snackbar__label {
					padding-left: 8px;
					color: rgba(var(--mo-color-background-base), 0.87)
				}

				div#icon {
					display: flex;
					height: 100%;
					align-items: center;
					justify-content: center;
					padding-left: 8px;
				}

				div#progress {
					position: absolute;
					bottom: 0;
					left: 0;
					right: 0px;
					width: 100%;
				}
			`
		]
	}

	@property({ reflect: true }) type?: SnackbarType

	private timer?: PeriodicTimer

	override timeoutMs = -1

	@renderContainer('div#icon')
	protected get iconTemplate() {
		return !this.type ? nothing : html`
			<mo-icon
				icon=${ifDefined(Snackbar.iconByType.get(this.type))}
				foreground='rgba(var(--mo-snackbar-color-base), 0.75)'
			></mo-icon>
		`
	}

	@renderContainer('slot[name="dismiss"]')
	protected get dismissIconButtonTemplate() {
		return html`
			<mo-icon-button icon='close' fontSize='18px' foreground='var(--mo-color-background)'></mo-icon-button>
		`
	}

	@renderContainer('div#progress')
	protected get progressBarTemplate() {
		return !this.timer ? nothing : html`
			<mo-linear-progress progress=${1 - this.timer.remainingTimeToNextTick / this.timer.period.milliseconds}></mo-linear-progress>
		`
	}

	@eventListener('mouseover')
	protected handleMouseOver() {
		this.timer?.pause()
	}

	@eventListener('mouseout')
	protected handleMouseOut() {
		this.timer?.run()
	}

	protected override initialized() {
		const snackbarElement = this.shadowRoot.querySelector('.mdc-snackbar')
		const surfaceElement = this.shadowRoot.querySelector('.mdc-snackbar__surface')

		window.setInterval(() => this.requestUpdate(), 100)

		const iconDiv = document.createElement('div')
		iconDiv.id = 'icon'
		surfaceElement?.insertBefore(iconDiv, surfaceElement.firstChild)

		const progressBarDiv = document.createElement('div')
		progressBarDiv.id = 'progress'
		snackbarElement?.append(progressBarDiv)
	}

	override async show() {
		const duration = !this.type ? Snackbar.defaultTimerPeriod : Snackbar.durationsByType.get(this.type) || Snackbar.defaultTimerPeriod
		this.timer = new PeriodicTimer(duration)
		super.show()
		await this.timer.waitForNextTick()
		this.close()
	}

	override close() {
		super.close()
		this.timer?.dispose()
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-snackbar': Snackbar
	}
}