import { element, html, property, TemplateResult, state, renderContainer, css, render, event, component, PropertyValues } from '../../library'
import { Option, Menu } from '..'
import { Field } from './Field'

type PluralizeUnion<T> = Array<T> | T | undefined

type Value = PluralizeUnion<string | number>
type Data<T> = PluralizeUnion<T>
type Index = PluralizeUnion<number>

type OptionsGetter<T> = {
	fetchData: () => Promise<Array<T>>
	renderOption: (data: T, index: number, array: Array<T>) => TemplateResult
}

/**
 * @slot
 * @fires dataChange {CustomEvent<Data<T>>}
 * @fires indexChange {CustomEvent<Index>}
 * @fires dataFetch {CustomEvent<Array<T>>}
 */
@component('mo-field-select')
export class FieldSelect<T> extends Field<Value> {
	static readonly optionsRenderLimit = 200

	@event() readonly dataChange!: EventDispatcher<Data<T>>
	@event() readonly indexChange!: EventDispatcher<Index>
	@event() readonly dataFetch!: EventDispatcher<Array<T>>

	@property({ type: Boolean, reflect: true }) open = false
	@property({ type: Boolean }) multiple = false
	@property({ type: Boolean, reflect: true }) reflectDefault = false
	@property()
	get default() { return this.querySelector<Option<T>>('mo-option[default]')?.text }
	set default(value) {
		Array.from(this.querySelectorAll('mo-option[default]')).forEach(o => o.remove())

		if (!value) {
			return
		}

		const defaultOption = new Option<T>()
		defaultOption.default = true
		defaultOption.innerText = value
		defaultOption.value = ''
		this.updateComplete.then(() => this.insertBefore(defaultOption, this.firstElementChild))
	}

	@state() private manualClose = false
	@state({
		observer: function (this: FieldSelect<T>) {
			this.fetchOptions()
		}
	}) protected optionsGetter: OptionsGetter<T> | undefined

	@element protected readonly menuOptions?: Menu | null

	protected fetchedData?: Array<T>

	private programmaticSelection = false

	override get value() { return super.value }
	override set value(value) {
		value = (value instanceof Array
			? value.map(v => v.toString())
			: value?.toString()) as PluralizeUnion<string>

		super.value = value
		this.programmaticSelection = true
		this.selectByValue(value).then(() => this.programmaticSelection = false)
	}

	@property({ type: Array })
	get index() {
		return (this.value instanceof Array
			? this.value.map(v => this.options.findIndex(o => o.value === v))
			: this.options.findIndex(o => o.value === this.value)) as Index
	}
	set index(value) { this.selectByIndex(value) }

	@property({ type: Array })
	get data() {
		return (this.value instanceof Array
			? this.value.map(v => this.options.find(o => o.value === v)?.data)
			: this.options.find(o => o.value === this.value)?.data) as Data<T>
	}
	set data(value) { this.selectByData(value) }

	get options() {
		return Array.from(this.querySelectorAll<Option<T>>('mo-option'))
	}

	get defaultOption() {
		return this.options.find(o => o.default)
	}

	get selectedOptions() {
		return this.menuOptions?.selected as Array<Option<T>> | Option<T> | undefined
	}

	static override get styles() {
		return css`
			${super.styles}

			input:hover {
				cursor: pointer;
			}

			mo-icon-button[part=dropDownIcon] {
				display: flex;
				align-items: center;
				color: var(--mo-color-gray);
			}

			:host([open]) mo-icon-button[part=dropDownIcon], :host([active]) mo-icon-button[part=dropDownIcon] {
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

			::slotted(*[mwc-list-item]:not([selected]):focus), ::slotted(*[mwc-list-item]:not([selected]):hover) {
				background-color: rgba(var(--mo-color-foreground-base), 0.05);
			}
		`
	}

	protected override firstUpdated(props: PropertyValues) {
		super.firstUpdated(props)
		this.value = this.value
		this.registerEventListeners()
		this.inputElement.readOnly = true
	}

	private registerEventListeners() {
		this.addEventListener('mouseover', () => this.manualClose = this.multiple)
		this.addEventListener('mouseout', () => this.manualClose = false)
		this.divContainer.addEventListener('click', () => this.open = !this.open)
		this.addEventListener('focus', () => this.inputElement.setSelectionRange(0, 0))
		this.addEventListener('keydown', (e: KeyboardEvent) => {
			const openKeys = [KeyboardKey.Enter]
			const navigationKeys = [KeyboardKey.ArrowDown, KeyboardKey.ArrowUp]
			if (openKeys.includes(e.key as KeyboardKey)) {
				e.stopImmediatePropagation()
			}
			if (this.open === false && [...openKeys, ...navigationKeys].includes(e.key as KeyboardKey)) {
				this.open = true
			}
			if (navigationKeys.includes(e.key as KeyboardKey)) {
				const focusedItem = this.menuOptions?.getFocusedItemIndex()
				this.menuOptions?.focusItemAtIndex(!focusedItem || focusedItem === -1 ? 0 : focusedItem)
			}
		})
		this.addEventListener('defaultClick', () => this.resetSelection())
	}

	@renderContainer('slot[name="trailingInternal"]')
	protected get dropDownIconTemplate() {
		return html`
			<mo-icon-button
				part='dropDownIcon'
				tabindex='-1'
				small
				icon='expand_more'
				@click=${() => this.open = !this.open}
			></mo-icon-button>
		`
	}

	protected override get template() {
		return html`
			${super.template}
			<mo-menu
				id='menuOptions'
				style=${this.offsetWidth ? `--mdc-menu-min-width: ${this.offsetWidth}px;` : ''}
				.anchor=${this as any}
				?multi=${this.multiple}
				?manualClose=${this.manualClose}
				fixed
				defaultFocus=${this.default ? 'FIRST_ITEM' : 'LIST_ROOT'}
				corner='BOTTOM_START'
				wrapFocus
				activatable
				?open=${this.open}
				@opened=${() => this.open = true}
				@closed=${() => this.open = false}
				@selected=${(e: CustomEvent<{ index: Set<number> | number }>) => this.handleOptionSelection(e)}
			>
				<slot></slot>
			</mo-menu>
		`
	}

	protected getValueOptions(value: Value) {
		const option = this.options.find(option => option.value === value)
		return value instanceof Array && this.multiple
			? this.options.filter(o => value.includes(o.value))
			: option ? [option] : []
	}

	protected fromValue(value: Value) {
		if ((value instanceof Array && value.length === 0) || !value) {
			return this.reflectDefault ? this.default ?? '' : ''
		}

		return getOptionsText(this.getValueOptions(value))
	}

	// TODO: why is this not needed?
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected toValue(_value: string) {
		return this.selectedOptions instanceof Array
			? this.selectedOptions.map(o => o.value).filter(o => !!o)
			: this.selectedOptions?.value
	}

	protected handleOptionSelection(e: CustomEvent<{ index: Set<number> | number }>) {
		if (this.programmaticSelection) {
			return
		}

		const indexes = e.detail.index instanceof Set ? Array.from(e.detail.index) : [e.detail.index]
		const options = this.options.filter((_, i) => indexes.includes(i))

		this.value = this.toValue(getOptionsText(options)) ?? undefined

		const toNumberIfPossible = (value?: number | string) => typeof value === 'number' ? value : value?.charAt(0) === '0' || isNaN(Number(value)) ? value : Number(value)
		const handledValues = (this.value instanceof Array
			? this.value.map(v => toNumberIfPossible(v))
			: toNumberIfPossible(this.value as string)) as PluralizeUnion<string>
		this.change.dispatch(handledValues)
		this.dataChange.dispatch(this.data)
		this.indexChange.dispatch(this.index)
	}

	protected async selectByData(data?: Data<T>) {
		await this.updateComplete
		this.value = (!(data instanceof Array)
			? this.options.find(o => JSON.stringify(o.data) === JSON.stringify(data))?.value
			: this.options
				.filter(o => !!o.data)
				.filter(o => data.map(v => JSON.stringify(v)).includes(JSON.stringify(o.data)))
				.map(o => o.value)) as Value
	}

	protected async selectByIndex(index?: Index) {
		await this.updateComplete
		this.value = !(index instanceof Array)
			// @ts-ignore if index is not an Array, it is a number
			? this.options[index].value
			: index.map(i => this.options[i])
				.filter(b => !!b)
				.map(o => o.value)

	}

	protected async selectByValue(value?: Value) {
		await this.updateComplete

		if (!value) {
			this.resetSelection()
			return
		}

		const options = this.getValueOptions(value)

		const indexes = !(value instanceof Array)
			? this.options.findIndex(o => o.value === value)
			: this.options
				.map((o, i) => options.includes(o) ? i : undefined)
				.filter(b => b !== undefined) as Array<number>

		const indexesToSelect = indexes instanceof Array
			? new Set(indexes) as Set<number>
			: indexes as number

		await this.updateComplete
		this.menuOptions?.select(indexesToSelect)
	}

	private resetSelection() {
		this.menuOptions?.select(this.multiple ? new Set<number>() : -1)
	}

	async fetchOptions() {
		if (!this.optionsGetter) {
			return
		}

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		this.fetchedData = await this.optionsGetter.fetchData() ?? []
		this.dataFetch.dispatch(this.fetchedData)

		Array.from(this.querySelectorAll('mo-option[fetched]')).forEach(o => o.remove())

		const fetchedOptions = this.fetchedData
			.slice(0, FieldSelect.optionsRenderLimit)
			.map(this.optionsGetter.renderOption)

		const div = document.createElement('div')
		render(fetchedOptions, div)
		const options = Array.from(div.querySelectorAll('mo-option'))
		options.forEach(o => {
			o.switchAttribute('fetched', true)
			if (this.multiple) {
				o.multiple = true
			}
		})
		div.remove()

		this.append(...options)

		this.value = this['_value']
	}
}

function getOptionsText<T>(options: Array<Option<T>>) {
	return options
		.filter(o => !o.default)
		.map(o => o.text)
		.join(', ')
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-select': FieldSelect<unknown>
	}
}