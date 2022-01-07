export class WindowHelper {
	private static readonly windowSizeReductionMultiplier = 0.9

	static open(path = window.location.pathname, options?: {
		popup?: boolean
		screenX?: number
		screenY?: number
		width?: number
		height?: number
	}) {
		return new Promise<Window>((resolve, reject) => {
			const featuresString = !options ? undefined : Object.entries(options)
				.map(([key, value]) => value === true ? key : `${key}=${value}`).join(',')
			const newWindow = window.open(path, undefined, featuresString)
			if (!newWindow) {
				return reject(new Error('Allow to open a window'))
			}
			if (options?.popup && !options.screenX && !options.screenY) {
				newWindow.resizeTo(
					window.outerWidth * WindowHelper.windowSizeReductionMultiplier,
					window.outerHeight * WindowHelper.windowSizeReductionMultiplier
				)
				newWindow.moveTo(
					window.screenX + (window.outerWidth - newWindow.outerWidth) / 2,
					window.screenY + (window.outerHeight - newWindow.outerHeight) / 2
				)
			}
			newWindow.addEventListener('MoDeL.initialized', () => resolve(newWindow))
		})
	}
}