import Bowser from 'bowser'

type Browser =
	| 'Chrome'
	| 'Microsoft Edge'
	| 'Opera'
	| 'Firefox'
	| 'Safari'

type OperatingSystem =
	| 'Windows'
	| 'macOS'
	| 'Linux'

export class ClientInfoHelper {
	private static readonly bowser = Bowser.getParser(window.navigator.userAgent)

	static get browser() {
		return this.bowser.getBrowserName() as Browser
	}

	static get operatingSystem() {
		return this.bowser.getOSName() as OperatingSystem
	}
}