type NativeTimerWithStartingDate = [startingDate: MoDate, timerId: number | undefined]

export class PeriodicTimer {
	private timer: NativeTimerWithStartingDate = [new MoDate, undefined]
	private temporaryPauseTimer?: NativeTimerWithStartingDate

	private pauses = new Array<[MoDate, MoDate | undefined]>()

	private get isPaused() {
		const last = this.pauses[this.pauses.length - 1]
		return !!last && last[1] === undefined
	}

	private get totalPaused() {
		return this.pauses.reduce(
			(acc, [start, end]) => acc.add(Temporal.Temporal.Duration.from({ milliseconds: (end ?? new MoDate).since(start).milliseconds })),
			Temporal.Temporal.Duration.from({ microseconds: 0 })
		)
	}

	readonly period: TimeSpan
	private readonly nextTickPromiseResolvers = new Set<(value: void | PromiseLike<void>) => void>()

	get remainingTimeToNextTick() {
		const period = this.period.milliseconds
		const now = new MoDate().getTime()
		const startingTime = this.timer[0].getTime()
		const pausedTotal = this.totalPaused.milliseconds
		return period - (now - startingTime) + pausedTotal
	}

	constructor(period: TimeSpan | number, runImmediately = true) {
		this.period = typeof period === 'number' ? TimeSpan.fromMilliseconds(period) : period
		if (runImmediately) {
			this.run()
		}
	}

	waitForNextTick() {
		return new Promise<void>(resolve => this.nextTickPromiseResolvers.add(resolve))
	}

	run() {
		if (this.isPaused) {
			const lastPause = this.pauses[this.pauses.length - 1]!
			lastPause[1] = new MoDate
			const remainingTimeToNextTick = this.remainingTimeToNextTick

			window.clearTimeout(this.temporaryPauseTimer?.[1])
			this.temporaryPauseTimer = [
				new MoDate,
				window.setTimeout(() => {
					this.callback()
					this.clearTimer()
					this.run()
				}, remainingTimeToNextTick)
			]

		} else {
			this.clearTimer()
			this.timer = [new MoDate, window.setInterval(this.callback, this.period.milliseconds)]
		}
	}

	pause() {
		if (this.isPaused === false) {
			this.pauses.push([new MoDate, undefined])
			this.clearTimer()
		}
	}

	dispose() {
		this.pauses = []
		this.clearTimer()
	}

	private clearTimer() {
		window.clearInterval(this.timer[1])
		this.timer[1] = undefined
	}

	private readonly callback = () => {
		if (this.isPaused === false) {
			this.pauses = []
			this.nextTickPromiseResolvers.forEach(resolve => resolve())
			this.nextTickPromiseResolvers.clear()
		}
	}
}