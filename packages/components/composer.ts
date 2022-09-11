import { Icon, IconVariant } from '@3mo/icon'
import { LoadingButton } from '@3mo/loading-button'
import { SplitButton } from './SplitButton'
import { MaterialDialog } from './MaterialDialog'

Icon.defaultVariant = IconVariant.Sharp

MaterialDialog.executingActionAdaptersByComponent.set(LoadingButton, (button, isExecuting) => {
	(button as LoadingButton).loading = isExecuting
})

MaterialDialog.executingActionAdaptersByComponent.set(SplitButton, (button, isExecuting) => {
	const Constructor = button.firstElementChild?.constructor as Constructor<HTMLElement> | undefined
	if (Constructor) {
		MaterialDialog.executingActionAdaptersByComponent.get(Constructor)?.(button.firstElementChild as HTMLElement, isExecuting)
	}
})