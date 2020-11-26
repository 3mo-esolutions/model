export default class PromiseTask {
	static async sleep(durationInMilliseconds: number) {
		return new Promise(resolve => setTimeout(resolve, durationInMilliseconds))
	}

	static async delegateToEventLoop<T = void>(task: () => T): Promise<T> {
		return new Promise<T>(resolve => setTimeout(() => resolve(task()), 1))
	}
}