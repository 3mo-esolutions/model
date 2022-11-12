import { component, TemplateResult, html } from '@a11d/lit'
import { LocalStorageEntry } from '@a11d/lit-application'
import { Localizer } from '../../localization'
import { DialogComponent, NotificationHost } from '@a11d/lit-application'

Localizer.register(LanguageCode.German, {
	'Deletion Confirmation': 'Löschbestätigung',
})

type Parameters = {
	readonly content: string | TemplateResult
	deletionAction?: () => void | PromiseLike<void>
}

@component('mo-dialog-deletion')
export class DialogDeletion extends DialogComponent<Parameters> {
	static readonly deletionConfirmation = new LocalStorageEntry('MoDeL.DialogDeletion.DeletionConfirmation', true)

	override async confirm() {
		if (DialogDeletion.deletionConfirmation.value === false) {
			try {
				await this.parameters.deletionAction?.()
				return
			} catch (e: any) {
				NotificationHost.instance?.notifyError(e.message)
				throw e
			}
		}

		return super.confirm()
	}

	protected override get template() {
		return html`
			<mo-dialog heading=${_('Deletion Confirmation')} primaryButtonText=${_('Delete')}>
				${this.parameters.content}
			</mo-dialog>
		`
	}

	protected override primaryAction = () => this.parameters.deletionAction?.() ?? Promise.resolve()
}