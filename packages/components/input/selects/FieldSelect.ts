import { html, property, state, css, event, component, query, style, live, eventListener } from '@a11d/lit'
import { Key } from '@a11d/lit-application'
import { Option, DeprecatedMenu, InputFieldComponent } from '../..'

type PluralizeUnion<T> = Array<T> | T | undefined

type Value = PluralizeUnion<string | number>
type Data<T> = PluralizeUnion<T>
type Index = PluralizeUnion<number>

function getOptionsText<T>(options: Array<Option<T>>) {
	return options
		.filter(o => !o.default)
		.map(o => o.text)
		.join(', ')
}

/**
 * @slot
 * @fires dataChange {CustomEvent<Data<T>>}
 * @fires indexChange {CustomEvent<Index>}
 */
@component('mo-field-select')
export class FieldSelect<T> extends InputFieldComponent<Value> {
	@event() readonly dataChange!: EventDispatcher<Data<T>>
	@event() readonly indexChange!: EventDispatcher<Index>

	@property({ type: Boolean, reflect: true }) open = false
	@property({ type: Boolean }) multiple = false
	@property({ type: Boolean, updated(this: FieldSelect<T>) { this.inputElement.readOnly = !this.searchable } }) searchable = false
	@property({ type: Boolean, reflect: true, updated(this: FieldSelect<T>) { Promise.delegateToEventLoop(() => this.value = this.value) } }) reflectDefault = false
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

	@property({
		type: Object,
		updated(this: FieldSelect<T>, value?: Value) {
			value = (value instanceof Array
				? value.map(v => v.toString())
				: value?.toString()) as PluralizeUnion<string>

			super.value = value
			this.programmaticSelection = true
			this.selectByValue(value).then(() => this.programmaticSelection = false)

			this.inputStringValue = this.fromValue(value)
		}
	}) value?: Value

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

	@state() private manualClose = false

	@query('#menuOptions') protected readonly menuOptions?: DeprecatedMenu | null

	private programmaticSelection = false

	private preventNextChange = false

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
			input:hover {
				cursor: pointer;
			}

			mo-icon-button[part=dropDownIcon] {
				display: flex;
				align-items: center;
				color: var(--mo-color-gray);
			}

			:host([open]) mo-icon-button[part=dropDownIcon], :host([active]) mo-icon-button[part=dropDownIcon] {
				color: var(--mo-color-accent);
			}

			mo-deprecated-menu {
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

	protected override get inputTemplate() {
		return html`
			<input
				part='input'
				type='text'
				autocomplete='off'
				?readonly=${this.readonly}
				?required=${this.required}
				?disabled=${this.disabled}
				.value=${live(this.inputStringValue || '')}
				@click=${() => this.open = !this.open}
			>
		`
	}

	@eventListener('mouseover')
	protected handleMouseOver() {
		this.manualClose = this.multiple
	}

	@eventListener('mouseout')
	protected handleMouseOut() {
		this.manualClose = false
	}

	@eventListener('keydown')
	protected handleKeyDown(e: KeyboardEvent) {
		const key = e.key as Key
		const openKeys = [Key.Enter]
		const navigationKeys = [Key.ArrowDown, Key.ArrowUp]

		if (openKeys.includes(key)) {
			e.stopImmediatePropagation()
			if (this.searchable) {
				this.preventNextChange = true
			}
		}

		if (this.open === false && [...openKeys, ...navigationKeys].includes(key)) {
			this.open = true
		}

		if (navigationKeys.includes(key)) {
			const focusedItem = this.menuOptions?.getFocusedItemIndex()
			this.menuOptions?.focusItemAtIndex(!focusedItem || focusedItem === -1 ? 0 : focusedItem)
		}
	}

	@eventListener('defaultClick')
	protected handleDefaultClick() {
		this.resetSelection()
	}

	protected override get endSlotTemplate() {
		return html`
			${super.endSlotTemplate}
			<div slot='end'>
				<mo-icon-button
					part='dropDownIcon'
					tabindex='-1'
					dense
					icon='expand_more'
					${style({ color: 'var(--mo-color-gray)' })}
					@click=${() => this.open = !this.open}
				></mo-icon-button>

				<mo-deprecated-menu
					id='menuOptions'
					style=${this.offsetWidth ? `--mdc-menu-min-width: ${this.offsetWidth}px;` : ''}
					.anchor=${this as any}
					?multi=${this.multiple}
					?manualClose=${this.manualClose}
					fixed
					defaultFocus=${this.searchable ? 'NONE' : this.default ? 'FIRST_ITEM' : 'LIST_ROOT'}
					corner='BOTTOM_START'
					activatable
					?open=${this.open}
					@opened=${() => this.open = true}
					@closed=${() => this.open = false}
					@selected=${() => this.handleOptionSelection()}
				>
					<slot></slot>
				</mo-deprecated-menu>
			</div>
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

	protected toValue() {
		return this.selectedOptions instanceof Array
			? this.selectedOptions.map(o => o.value).filter(o => !!o)
			: this.selectedOptions?.value
	}

	protected override handleFocus() {
		super.handleFocus()
		this.inputElement.setSelectionRange(0, 0)
		if (this.searchable) {
			this.select()
		}
	}

	protected override handleInput(v: Value, e: Event) {
		super.handleInput(v, e)
		if (this.searchable) {
			this.searchOptions()
		}
	}

	protected override handleChange(v?: Value, e?: Event) {
		if (this.preventNextChange) {
			this.preventNextChange = false
			return
		}
		super.handleChange(v, e)
	}

	protected handleOptionSelection() {
		if (this.programmaticSelection) {
			return
		}

		this.value = this.toValue() ?? undefined

		const toNumberIfPossible = (value?: number | string) => typeof value === 'number' ? value : value?.charAt(0) === '0' || isNaN(Number(value)) ? value : Number(value)
		const handledValues = (this.value instanceof Array
			? this.value.map(v => toNumberIfPossible(v))
			: toNumberIfPossible(this.value as string)) as PluralizeUnion<string>

		this.options.filter(o => o.selected && (handledValues instanceof Array
			? handledValues.includes(toNumberIfPossible(o.value) as string) === false
			: handledValues !== toNumberIfPossible(o.value))
		).forEach(o => o.activated = o.selected = false)

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
			? this.options[Number(index)]!.value
			: index.map(i => this.options[i]!.value)
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

	protected get searchKeyword() {
		return this.inputElement.value.toLowerCase()
	}

	private async searchOptions() {
		await this.search()
		await this.updateComplete
		this.open = this.options.length > 0
	}

	protected search() {
		const matchedValues = this.options
			.filter(option => option.text.toLowerCase().includes(this.searchKeyword))
			.map(option => option.value)
		this.filterOptions(matchedValues)
		return Promise.resolve()
	}

	private filterOptions(matchedValues: Array<Value>) {
		const matchedOptions = this.options.filter(o => matchedValues.includes(o.value))
		this.options.forEach(option => {
			const matches = matchedOptions.includes(option)
			option.style.height = matches ? '' : '0px'
			option.switchAttribute('mwc-list-item', matches)
		})
		if (this.menuOptions?.listElement?.['items_']) {
			this.menuOptions.listElement['items_'] = matchedOptions
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-select': FieldSelect<unknown>
	}
}