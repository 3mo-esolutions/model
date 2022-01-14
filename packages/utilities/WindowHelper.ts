import { PwaHelper } from '.'

export const enum WindowOpenMode { Tab, Window }

export class WindowHelper {
	private static readonly windowSizeReductionMultiplier = 0.9

	static open(path = window.location.pathname, mode = WindowOpenMode.Tab) {
		return new Promise<Window>((resolve, reject) => {
			if (PwaHelper.isInstalled && mode === WindowOpenMode.Tab && Manifest.display_override?.includes('tabbed') === false) {
				mode = WindowOpenMode.Window
			}

			const newWindow = window.open(path, undefined, mode === WindowOpenMode.Tab ? '' : 'popup')
			if (!newWindow) {
				return reject(new Error('Failed to open a window, probably because the permission is denied.'))
			}

			newWindow.resizeTo(
				window.outerWidth * WindowHelper.windowSizeReductionMultiplier,
				window.outerHeight * WindowHelper.windowSizeReductionMultiplier
			)

			newWindow.moveTo(
				window.screenX + (window.outerWidth - newWindow.outerWidth) / 2,
				window.screenY + (window.outerHeight - newWindow.outerHeight) / 2
			)

			newWindow.addEventListener('MoDeL.initialized', () => resolve(newWindow))
		})
	}

	static async openAndFocus(...args: Parameters<typeof WindowHelper.open>) {
		const window = await WindowHelper.open(...args)
		window.focus()
	}
}