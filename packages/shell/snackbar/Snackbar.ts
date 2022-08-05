import { component, html, css, ComponentMixin, renderContainer, property, eventListener, ifDefined, nothing, unsafeCSS } from '../../library'
import { MaterialIcon } from '../../components'
import { nonInertable, NotificationType } from '..'
import { PeriodicTimer } from '../../utilities'
import { Snackbar as MwcSnackbar } from '@material/mwc-snackbar'

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
	private static readonly defaultDuration = 5_000

	private static readonly defaultTimerPeriodByType = new Map<NotificationType, number>([
		[NotificationType.Info, 5_000],
		[NotificationType.Success, 5_000],
		[NotificationType.Warning, 10_000],
		[NotificationType.Error, 15_000],
	])

	private static readonly iconByType = new Map<NotificationType, MaterialIcon>([
		[NotificationType.Info, 'info'],
		[NotificationType.Success, 'check_circle'],
		[NotificationType.Warning, 'warning'],
		[NotificationType.Error, 'error'],
	])

	static override get styles() {
		return [
			...super.styles,
			css`
				:host {
					--mo-snackbar-info-color-base: 0, 119, 200;
					--mo-snackbar-success-color-base : 93, 170, 96;
					--mo-snackbar-warning-color-base: 232, 152, 35;
					--mo-snackbar-error-color-base: 221, 61, 49;
					width: 100%;
				}

				:host([type=${unsafeCSS(NotificationType.Info)}]) {
					--mo-snackbar-color-base: var(--mo-snackbar-info-color-base);
				}

				:host([type=${unsafeCSS(NotificationType.Success)}]) {
					--mo-snackbar-color-base: var(--mo-snackbar-success-color-base);
				}

				:host([type=${unsafeCSS(NotificationType.Warning)}]) {
					--mo-snackbar-color-base: var(--mo-snackbar-warning-color-base);
				}

				:host([type=${unsafeCSS(NotificationType.Error)}]) {
					--mo-snackbar-color-base: var(--mo-snackbar-error-color-base);
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

	@property({ reflect: true }) type?: NotificationType
	@property({ type: Number }) duration?: number

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
			<mo-linear-progress progress=${1 - this.timer.remainingTimeToNextTick / this.timer.period.milliseconds + 0.075}></mo-linear-progress>
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
		const surfaceElement = this.renderRoot.querySelector('.mdc-snackbar__surface')

		window.setInterval(() => this.requestUpdate(), 100)

		const iconDiv = document.createElement('div')
		iconDiv.id = 'icon'
		surfaceElement?.insertBefore(iconDiv, surfaceElement.firstChild)

		const progressBarDiv = document.createElement('div')
		progressBarDiv.id = 'progress'
		surfaceElement?.append(progressBarDiv)
	}

	override async show() {
		const typeDuration = !this.type ? undefined : Snackbar.defaultTimerPeriodByType.get(this.type)
		const duration = this.duration ?? typeDuration ?? Snackbar.defaultDuration
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