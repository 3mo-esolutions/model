/* eslint-disable @typescript-eslint/member-ordering */
import { component, css, property, event, html, HTMLTemplateResult } from '@a11d/lit'
import { TemplateHelper } from '../../../library'
import { FetcherController } from '../../../utilities'
import { PropertyValues } from '../../..'
import { FieldSelect } from './FieldSelect'
import { Option } from './Option'

export type FieldFetchableSelectParametersType = Record<string, unknown> | void

/**
 * @fires parametersChange {CustomEvent<TDataFetcherParameters | undefined>}
 * @fires dataFetch {CustomEvent<Array<T>>}
 */
@component('mo-field-fetchable-select')
export class FieldFetchableSelect<T, TDataFetcherParameters extends FieldFetchableSelectParametersType = void> extends FieldSelect<T> {
	private static readonly fetchedOptionsRenderLimit = 200

	@event() readonly dataFetch!: EventDispatcher<Array<T>>

	@property({ type: Number }) optionsRenderLimit = FieldFetchableSelect.fetchedOptionsRenderLimit
	@property({ type: Object }) optionTemplate?: (data: T, index: number, array: Array<T>) => HTMLTemplateResult

	@property({ type: Object, updated(this: FieldFetchableSelect<T>) { this.requestFetch() } }) parameters?: TDataFetcherParameters
	@property({ type: Object }) searchParameters?: (keyword: string) => Partial<TDataFetcherParameters>

	@property({ type: Object }) fetch?: (parameters: TDataFetcherParameters | undefined) => Promise<Array<T>>

	@property({ type: Number })
	get debounce() { return this.fetcherController.debounce }
	set debounce(value) { this.fetcherController.debounce = value }

	readonly fetcherController = new FetcherController(this, {
		fetchEvent: this.dataFetch,
		fetcher: async () => {
			const searchParameters = this.searchParameters?.(this.searchKeyword) ?? {}
			const parameters = {
				...this.parameters,
				...searchParameters
			} as TDataFetcherParameters
			return await this.fetch?.(parameters) || []
		},
	})

	static override get styles() {
		return css`
			${super.styles}

			:host([fetching]):after {
				visibility: visible;
				animation: fetching 1s linear infinite;
			}

			@keyframes fetching {
				0% {
					inset-inline-start: -40%;
					width: 0%;
				}
				50% {
					inset-inline-start: 20%;
					width: 80%;
				}
				100% {
					inset-inline-start: 100%;
					width: 100%;
				}
			}
		`
	}

	protected override get template() {
		this.switchAttribute('fetching', this.fetcherController.isFetching)
		return super.template
	}

	protected override firstUpdated(props: PropertyValues) {
		super.firstUpdated(props)
		if (!this.parameters) {
			this.requestFetch()
		}
	}

	protected override async search() {
		if (!this.searchParameters) {
			return super.search()
		} else {
			await this.requestFetch(true)
		}
	}

	async requestFetch(skipValueEvaluation = false) {
		await this.fetcherController.fetch()
		this.renderFetchedDataOptions()
		if (!skipValueEvaluation) {
			this.value = this['_value']
		}
	}

	private renderFetchedDataOptions() {
		const optionsTemplate = html`
			${this.fetcherController.data?.map((data, index, array) => this.optionTemplate?.(data, index, array) ?? html`
				<mo-option .data=${data} value=${index}>${data}</mo-option>
			`)}
		`
		this.fetchedOptions = TemplateHelper.extractAllBySelector(optionsTemplate, 'mo-option') as Array<Option<T>>
	}

	private get fetchedOptions() { return Array.from(this.querySelectorAll<Option<T>>('mo-option[fetched]')) }
	private set fetchedOptions(value) {
		this.fetchedOptions.forEach(o => o.remove())
		const optionsToAppend = value.slice(0, this.optionsRenderLimit)
		const fieldValue = this.value
		if (fieldValue instanceof Array && fieldValue.length > 0) {
			optionsToAppend.push(...value.filter(o => fieldValue.includes(o.value)))
		} else if (fieldValue) {
			const preselectedValueOption = value.find(o => o.value === fieldValue)
			if (preselectedValueOption) {
				optionsToAppend.push(preselectedValueOption)
			}
		}
		optionsToAppend.forEach(o => {
			o.switchAttribute('fetched', true)
			if (this.multiple) {
				o.multiple = true
			}
		})
		this.append(...optionsToAppend)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-fetchable-select': FieldFetchableSelect<unknown>
	}
}