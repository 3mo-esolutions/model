# Reference DOM-Elements of a Component Template

To save a reference to an element existing in the template through its **ID** use one of the `@query()`, `@queryAll()` or `@element` decorators which create getter properties in the component which point to those elements.

> ✔ As the whole library is written in TypeScript use the correct types of element references.

## Samples

```typescript
	import { Component, component, html, element, query, queryAll } from '@3mo/model/library'
	import { Button, FieldSelect, Option } from '@3mo/model/components'

	@component('app-page-name')
	export class PageName extends Component {
		@query('mo-field-select') private readonly fieldSelectElement!: FieldSelect<string>
		@queryAll('mo-option') private readonly optionElements!: Array<Option<string>>
		@element private readonly theButtonElement!: Button

		protected render = () => html`
			<mo-page header='Element References'>
				<mo-field-select label='Which one'>
					<mo-option value='a'>A</mo-option>
					<mo-option value='b'>B</mo-option>
					<mo-option value='c'>C</mo-option>
				</mo-field-select>

				<mo-button id='theButton'>Element with Id</mo-button>
			</mo-page>
		`
	}
```

> ❌ Prevent accessing element references in the `constructor`.
>
> As long as the component isn't done rendering for the first time, element references stay `undefined`.
