import { Temporal as TemporalNamespace, Intl } from '@js-temporal/polyfill'
export { TemporalNamespace as Temporal, Intl as TemporalIntl }

globalThis.Temporal = TemporalNamespace

declare global {
	// eslint-disable-next-line
	var Temporal: typeof TemporalNamespace
}