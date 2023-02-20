import { Icon, IconVariant } from '@3mo/icon'
import { LoadingButton } from '@3mo/loading-button'
import { SplitButton } from './SplitButton'
import { Dialog } from '@3mo/dialog'
import { Localizer } from '@3mo/localization'

Icon.defaultVariant = IconVariant.Sharp

Dialog.executingActionAdaptersByComponent.set(LoadingButton, (button, isExecuting) => {
	(button as LoadingButton).loading = isExecuting
})

Dialog.executingActionAdaptersByComponent.set(SplitButton, (button, isExecuting) => {
	const Constructor = button.firstElementChild?.constructor as Constructor<HTMLElement> | undefined
	if (Constructor) {
		Dialog.executingActionAdaptersByComponent.get(Constructor)?.(button.firstElementChild as HTMLElement, isExecuting)
	}
})

Localizer.register(LanguageCode.German, {
	'Close': 'Schließen',
	'Cancel': 'Abbrechen',
	'Expand': 'Erweitern',
	'Collapse': 'Reduzieren',
	'Loading': 'Lädt',
})