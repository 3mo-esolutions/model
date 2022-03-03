/* eslint-disable import/no-internal-modules */
export { CSSResult, html, css, unsafeCSS, CSSResultArray, TemplateResult, PropertyValues, ReactiveControllerHost, ReactiveElement } from 'lit'
export { customElement as component, queryAsync } from 'lit/decorators.js'
export * from 'lit/directive.js'
export { render } from 'lit-html'
export { repeat } from 'lit-html/directives/repeat.js'
export { cache } from 'lit-html/directives/cache.js'
export { ifDefined } from 'lit-html/directives/if-defined.js'
export { until } from 'lit-html/directives/until.js'
export { live } from 'lit-html/directives/live.js'
export { styleMap } from 'lit-html/directives/style-map.js'
export { classMap } from 'lit-html/directives/class-map.js'
export * from './helpers'
export * from './decorators'
export * from './StyleMixin'
export * from './ComponentMixin'
export * from './Component'
export * from './Controller'
import './global'

import { TemplateResult, nothing as nothingTemplate } from 'lit-html'
const nothing = nothingTemplate as unknown as TemplateResult<1>
export { nothing }