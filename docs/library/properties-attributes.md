# Properties & Attributes

managing the component state can be achieved using properties. Also mapping a property to an attributes enables the ability to pass these states from without the component through HTML attributes.

``` ts
// HelloWorld.ts
import { Component, component, property } from '@3mo/model'

@component('app-hello-world')
export class HelloWorld extends Component {
	@property() name = 'World'

	protected override get template() {
		return html`<div>Hello ${this.name}</div>`
	}
}
```

Every change to the `name` property causes the template to be rerendered efficiently, as the position of those placeholders can be remembered by LitElement which itself is a feature of JavaScript's Tagged Template Literals.

Also the HTML attribute is implicitly mapped to the property and can be used as the following
``` html
<app-hello-world name='Fancy World'></app-hello-world>
```