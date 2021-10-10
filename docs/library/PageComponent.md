# Page Components

Page Components are defined as components which extend the provided `PageComponent` class.

## Create a Page
Creating pages are just like [creating components](./component-creation.md) with the difference that you should extend the `PageComponent` class.

> ✔ Conventionally, the name of a page component class starts with `Page` e.g. `PageHome`

## Differences to Component
Page components have 3 differences to a regular component.

### 1. Root Element
It must contain a `mo-page` element in its root. It has relevant properties for a page such as `header` and `fullHeight`

### 2. Routing and Parameters
It accepts routes to make the page accessible through an URL, and URL parameters can be intercepted.

Provide the generic parameter to shape the `parameters` property of the `PageComponent` class. It is then required for creating every instance of that dialog component. A record of strings and numbers are allowed, as others are not compatible for URLs.

To be able to pass those parameters, the route should also contain those parameters, so MoDeL can map those via [Route Parser](https://github.com/rcs/route-parser).

### 3. Authorizations
It can check for the authorizations and fallback to a 403 error page if authorizations are denied.

```ts
@route('/sample/:id')
@authorize('authorization1', 'authorization2')
@component('app-page-name')
export class PageName extends PageComponent<{ id: number }> {
	protected override get template() {
		return html`
			<mo-page header='Header'>
				The passed parameter "id" is: ${this.parameters.id}
			</mo-page>
		`
	}
}
```