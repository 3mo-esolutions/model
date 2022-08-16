import { Localizer } from '../../localization'

Localizer.register(LanguageCode.German, { 'Dialog cancelled': 'Dialog abgebrochen' })

export class DialogCancelledError extends Error {
	constructor() {
		super(_('Dialog cancelled'))
	}
}