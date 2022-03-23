import { Temporal as TemporalNamespace, toTemporalInstant, Intl } from '@js-temporal/polyfill'

globalThis.Temporal = TemporalNamespace
window.Temporal = TemporalNamespace
Object.defineProperty(Date.prototype, 'temporalInstant', {
	get(this) { return toTemporalInstant.call(this) }
})

export { TemporalNamespace as Temporal, Intl as TemporalIntl }

declare global {
	// eslint-disable-next-line
	var Temporal: typeof TemporalNamespace
	interface Date {
		readonly temporalInstant: TemporalNamespace.Instant
	}
}