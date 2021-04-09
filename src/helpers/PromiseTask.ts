export default class PromiseTask {
	static sleep(durationInMilliseconds: number) {
		return new Promise(resolve => setTimeout(resolve, durationInMilliseconds))
	}

	static delegateToEventLoop<T = void>(task: () => T) {
		return new Promise<T>(resolve => setTimeout(() => resolve(task()), 1))
	}
}

globalThis.PromiseTask = PromiseTask

type PromiseTaskType = typeof PromiseTask

declare global {
	// eslint-disable-next-line no-var
	var PromiseTask: PromiseTaskType
}