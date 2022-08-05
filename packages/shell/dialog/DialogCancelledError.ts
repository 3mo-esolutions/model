export class DialogCancelledError extends Error {
	constructor() {
		super('Dialog cancelled.')
	}
}