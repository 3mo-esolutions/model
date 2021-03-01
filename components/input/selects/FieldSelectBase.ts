import { element, html, property, nothing, TemplateResult, internalProperty, renderContainer, css } from '../../../library'
import { Option, Menu } from '../..'
import { Field } from '../Field'

type SelectBasePluralize<TMulti extends boolean, TReturn> = TMulti extends true ? Array<TReturn> : (TReturn | undefined)

type SelectBaseValue<TMulti extends boolean> = SelectBasePluralize<TMulti, string>
type SelectBaseData<T, TMulti extends boolean> = SelectBasePluralize<TMulti, T>
type SelectBaseIndex<TMulti extends boolean> = SelectBasePluralize<TMulti, number>


type OptionsGetter<T> = {
	fetchData: () => Promise<Array<T>>
	renderOption: (data: T, index: number, array: Array<T>) => TemplateResult
}

/**
 * @fires dataChange
 * @fires indexChange
 * @fires dataFetch
 */
export abstract class FieldSelectBase<T, TMulti extends boolean = false> extends Field<SelectBaseValue<TMulti>> {
	static readonly optionsRenderLimit = 50

	@eventProperty() protected readonly dataChange!: IEvent<SelectBaseData<T, TMulti>>
	@eventProperty() protected readonly indexChange!: IEvent<SelectBaseIndex<TMulti>>
	@eventProperty() protected readonly dataFetch!: IEvent<Array<T>>

	protected abstract defaultValue: SelectBaseValue<TMulti>

	@property({ type: Boolean, reflect: true }) open = false
	@property({ type: Boolean, reflect: true }) reflectDefault = false
	@property() default?: string

	private programmaticSelection = false
	get value() { return super.value }
	set value(value) {
		super.value = value
		this.programmaticSelection = true
		this.selectByValue(value).then(() => this.programmaticSelection = false)
	}

	@property({ type: Object })
	get index() {
		return (this.value instanceof Array
			? this.value.map(v => this.options.findIndex(o => o.value === v))
			: this.options.findIndex(o => o.value === this.value)) as SelectBaseIndex<TMulti>
	}
	set index(value) { this.selectByIndex(value) }

	@property({ type: Object })
	get data() {
		return (this.value instanceof Array
			? this.value.map(v => this.options.find(o => o.value === v)?.data)
			: this.options.find(o => o.value === this.value)?.data) as SelectBaseData<T, TMulti>
	}
	set data(value) { this.selectByData(value) }

	get options() {
		return [
			...Array.from(this.menuOptions?.querySelectorAll<Option<T>>('mo-option') ?? []),
			...Array.from(this.querySelectorAll<Option<T>>('mo-option'))
		]
	}

	get defaultOption() {
		return this.options.find(o => o.default)
	}

	get selectedOptions() {
		return this.menuOptions?.selected as TMulti extends true ? Array<Option<T>> : Option<T>
	}

	static get styles() {
		return css`
			${super.styles}

			mo-icon-button[part=dropDownIcon] {
				color: var(--mo-color-gray);
			}

			:host([open]) mo-icon-button[part=dropDownIcon] {
				color: var(--mo-accent);
			}

			mo-menu {
				--mdc-theme-surface: var(--mo-color-background);
				--mdc-menu-item-height: 36px;
			}

			slot:not([name]) {
				display: flex;
				flex-direction: column;
				align-items: stretch;
			}
		`
	}

	protected initialized() {
		super.initialized()
		this.addEventListener('focus', () => this.open = true)
		this.addEventListener('blur', () => this.open = false)
	}

	@renderContainer('slot[name="trailingInternal"]')
	protected get dropDownIconTemplate() {
		return html`
			<mo-icon-button
				part='dropDownIcon'
				tabindex='-1'
				small
				icon='arrow_drop_down'
				@click=${() => this.open = !this.open}
			></mo-icon-button>
		`
	}

	@element protected readonly menuOptions?: Menu | null

	protected render() {
		const defaultOption = this.default === undefined ? nothing : html`
			<mo-option default .rawValue=${this.defaultValue}>
				${this.default}
			</mo-option>
		`

		const fetchedOptions = !this.optionsGetter || !this.fetchedData ? undefined : this.fetchedData
			.slice(0, FieldSelectBase.optionsRenderLimit)
			.map(this.optionsGetter.renderOption)

		return html`
			${super.render()}
			<mo-menu
				id='menuOptions'
				style='${this.offsetWidth ? `--mdc-menu-min-width: ${this.offsetWidth}px;` : ''}'
				.anchor=${this}
				fixed
				wrapFocus
				defaultFocus='FIRST_ITEM'
				corner='BOTTOM_START'
				activatable
				?open=${this.open}
				@opened=${this.handleMenuOpened}
				@closed=${this.handleMenuClosed}
				@selected=${this.handleOptionSelection}
			>
				${defaultOption}
				${fetchedOptions ?? html`<slot></slot>`}
			</mo-menu>
		`
	}

	protected abstract getValueOptions(value: SelectBaseValue<TMulti>): Array<Option<T>>

	protected fromValue(value: SelectBaseValue<TMulti>) {
		if (!value)
			return this.reflectDefault ? this.default ?? '' : ''

		return getOptionsText(this.getValueOptions(value))
	}

	protected handleOptionSelection = (e: CustomEvent<{ index: Set<number> | number }>) => {
		if (this.programmaticSelection)
			return

		const isDefaultSelected = this.options.filter(o => o.selected).every(o => o.default)
		if (this.value !== this.defaultValue && isDefaultSelected) {
			this.resetSelection()
			this.value = this.defaultValue
			this.change.trigger(this.value)
			this.blur()
			return
		}

		const indexes = e.detail.index instanceof Set ? Array.from(e.detail.index) : [e.detail.index]
		const options = this.options.filter((_, i) => indexes.includes(i))

		this.value = this.toValue(getOptionsText(options)) ?? this.defaultValue
		this.change.trigger(this.value)
		this.dataChange.trigger(this.data)
		this.indexChange.trigger(this.index)
	}

	private async selectByData(data?: SelectBaseData<T, TMulti>) {
		await this.updateComplete
		this.value = (!(data instanceof Array)
			? this.options.find(o => JSON.stringify(o.data) === JSON.stringify(data))?.value
			: this.options
				.filter(o => !!o.data)
				.filter(o => data.map(v => JSON.stringify(v)).includes(JSON.stringify(o.data)))
				.map(o => o.value)) as SelectBaseValue<TMulti>
	}

	private async selectByIndex(index?: SelectBaseIndex<TMulti>) {
		await this.updateComplete
		this.value = !(index instanceof Array)
			// @ts-ignore if index is not an Array, it is a number
			? this.options[index].value
			: index.map(i => this.options[i])
				.filter(b => !!b)
				.map(o => o.value)

	}

	private async selectByValue(value?: SelectBaseValue<TMulti>) {
		await this.updateComplete

		if (!value || value === this.defaultValue) {
			this.resetSelection()
			return
		}

		const options = this.getValueOptions(value)

		const indexes = !(value instanceof Array)
			? this.options.findIndex(o => o.value === value)
			: this.options
				.map((o, i) => options.includes(o) ? i : undefined)
				.filter(b => !!b) as Array<number>

		const indexesToSelect = indexes instanceof Array
			? new Set(indexes) as Set<number>
			: indexes as number

		await this.updateComplete
		this.menuOptions?.select(indexesToSelect)
	}

	private resetSelection() {
		this.menuOptions?.select(this.defaultValue instanceof Array ? new Set<number>() : -1)
	}

	// REFACTOR: find a better way for `opening`
	private opening = false
	protected handleMenuOpened = async () => {
		this.opening = true
		this.open = true
		await this.updateComplete
		await PromiseTask.sleep(300)
		this.opening = false
	}

	protected handleMenuClosed = () => {
		if (!this.opening) {
			this.open = false
		}
	}

	@internalProperty({ observer: optionGetterChanged }) protected optionsGetter: OptionsGetter<T> | undefined
	@internalProperty() private fetchedData?: Array<T>

	async fetchOptions() {
		const optionsGetter = this.optionsGetter

		if (!optionsGetter)
			return

		this.fetchedData = await optionsGetter.fetchData()
		await this.updateComplete
		this.dataFetch.trigger(this.fetchedData)
	}
}

function getOptionsText<T>(options: Array<Option<T>>) {
	return options
		.filter(o => !o.default)
		?.map(o => o.innerText)
		.join(', ')
		?? ''
}

async function optionGetterChanged(this: FieldSelectBase<unknown>) {
	await this.fetchOptions()
	this.value = this['_value']
}