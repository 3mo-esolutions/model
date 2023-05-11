/* eslint-disable @typescript-eslint/no-unused-vars */
Promise.sleep = function (durationInMilliseconds: number) {
	return new Promise<void>(resolve => setTimeout(resolve, durationInMilliseconds))
}

Promise.delegateToEventLoop = function <T = void>(task: () => T) {
	return new Promise<T>(resolve => setTimeout(() => resolve(task()), 1))
}

interface PromiseConstructor {
	sleep(durationInMilliseconds: number): Promise<void>
	delegateToEventLoop<T = void>(task: () => T): Promise<T>
}