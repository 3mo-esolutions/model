import { Component, state, css, html, TemplateHelper, component, ifDefined } from '../../library'
import { nonInertable } from '../helpers'
import { Snackbar } from './Snackbar'

export const enum NotificationType {
	Info = 'info',
	Success = 'success',
	Warning = 'warning',
	Error = 'error',
}


type Notification = {
	readonly type?: NotificationType
	readonly message: string
	readonly actions?: Array<NotificationAction>
}

type NotificationAction = {
	readonly title: string
	readonly handleClick: NotificationActionClickHandler
}

type NotificationActionClickHandler = () => void | PromiseLike<void>

type NonTypedNotification = [notification: Omit<Notification, 'type'>] | [message: string, ...actions: Array<NotificationAction>]

function normalizeNonTypedNotificationParameters(...parameters: NonTypedNotification) {
	return typeof parameters[0] !== 'string' ? parameters[0] : {
		message: parameters[0],
		actions: parameters.slice(1) as Array<NotificationAction>,
	}
}

@component('mo-notification-host')
@nonInertable()
export class NotificationHost extends Component {
	static readonly shownNotifications = new Set<Notification>()

	static get instance() { return MoDeL.application.notificationHost }

	notifyInfo(...notification: NonTypedNotification) {
		return this.notify({ type: NotificationType.Info, ...normalizeNonTypedNotificationParameters(...notification) })
	}

	notifySuccess(...notification: NonTypedNotification) {
		return this.notify({ type: NotificationType.Success, ...normalizeNonTypedNotificationParameters(...notification) })
	}

	notifyWarning(...notification: NonTypedNotification) {
		return this.notify({ type: NotificationType.Warning, ...normalizeNonTypedNotificationParameters(...notification) })
	}

	notifyError(...notification: NonTypedNotification) {
		return this.notify({ type: NotificationType.Error, ...normalizeNonTypedNotificationParameters(...notification) })
	}

	notifyAndThrowError(...notification: NonTypedNotification) {
		const normalizedNotification = normalizeNonTypedNotificationParameters(...notification)
		this.notifyError(normalizedNotification)
		throw new Error(normalizedNotification.message)
	}

	async notify(notification: Notification) {
		const close = async () => {
			snackbar.close()
			await Promise.all([this.updateComplete, snackbar.updateComplete])
			this.snackbars.delete(snackbar)
			this.requestUpdate()
		}

		const handleAction = async (action: NotificationActionClickHandler) => {
			await action()
			await close()
		}

		const snackbarTemplate = html`
			<mo-snackbar labelText=${notification.message}
				?stacked=${(notification.actions?.length ?? 0) > 1}
				type=${ifDefined(notification.type)}
				@MDCSnackbar:closed=${close}
			>
				${notification.actions?.map(action => html`
					<mo-loading-button slot='action' @click=${() => handleAction(action.handleClick)}>${action.title}</mo-loading-button>
				`)}
			</mo-snackbar>
		`

		const snackbar = TemplateHelper.extractBySelector(snackbarTemplate, 'mo-snackbar')
		NotificationHost.shownNotifications.add(notification)
		await this.showSnackbar(snackbar)
	}

	static override get styles() {
		return css`
			:host {
				z-index: 8;
				position: fixed;
				inset-block-end: 0;
				inset-inline: 0;
				max-height: max(50vh, 50%);

				display: grid;
				justify-items: center;
				justify-content: center;
				gap: 0.5vh;

				overflow: hidden;

				/* optimizations */
				pointer-events: none;
			}

			mo-snackbar {
				position: relative;
				--mo-snackbar-position: relative;
			}
		`
	}

	// eslint-disable-next-line @typescript-eslint/member-ordering
	@state() private readonly snackbars = new Set<Snackbar>()

	protected override get template() {
		return html`${this.snackbars}`
	}

	private async showSnackbar(snackbar: Snackbar) {
		this.snackbars.add(snackbar)

		const promise = snackbar.show()

		this.requestUpdate()
		await this.updateComplete

		snackbar.scrollIntoView({ behavior: 'smooth' })

		await promise
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-notification-host': NotificationHost
	}
}