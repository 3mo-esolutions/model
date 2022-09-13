export type Sound =
	| 'success.mp3'
	| 'error.mp3'

export class Player {
	static async play(sound: Sound) {
		await new Audio(`/assets/sounds/${sound}`).play()
	}
}