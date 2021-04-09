/* eslint-disable */
export { customElement as component, CSSResult, queryAsync, html, css, unsafeCSS, CSSResultArray, TemplateResult, PropertyValues } from 'lit-element'
export { render, NodePart, directive } from 'lit-html'
export { repeat } from 'lit-html/directives/repeat'
export { cache } from 'lit-html/directives/cache'
export { ifDefined } from 'lit-html/directives/if-defined'
export { until } from 'lit-html/directives/until'
export { live } from 'lit-html/directives/live'
export { styleMap } from 'lit-html/directives/style-map'
export * from './event'
export * from './component'
export * from './page'
export * from './dialog'
export * from './application'
export * from './snackbar'
export * from './contextMenu'

import { TemplateResult, nothing as nothingTemplate } from 'lit-html'
const nothing = nothingTemplate as TemplateResult
export { nothing }