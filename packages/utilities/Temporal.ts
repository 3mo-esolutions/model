import * as TemporalNamespace from 'temporal-polyfill'
export { TemporalNamespace as Temporal }

globalThis.Temporal = TemporalNamespace

declare global {
	// eslint-disable-next-line
	var Temporal: typeof TemporalNamespace
}