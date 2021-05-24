import Bowser from 'bowser'

type Browser =
	| 'Chrome'
	| 'Firefox'
	| 'Opera'

type OperatingSystem =
	| 'Windows'
	| 'macOS'
	| 'Linux'

export default class ClientInfoHelper {
	private static readonly bowser = Bowser.getParser(window.navigator.userAgent)

	static get browser() {
		return this.bowser.getBrowserName() as Browser
	}

	static get operatingSystem() {
		return this.bowser.getOSName() as OperatingSystem
	}

	static get browserZoomLevel() {
		return window.outerWidth / window.innerWidth / 1.27617148554337
	}
}