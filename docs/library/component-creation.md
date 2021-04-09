# Component Creation

Components are regular ES6 class modules which extend the provided `Component` class.

## 1. Create the Component Class

In a new TypeScript file. Implement a class which inherits from the **Component** class and decorate it with `@component()` decorator factory, both provided by MoDeL.

## 2. Add an HTML-Template

Define your HTML template in the render method of the component class instance

## 3. Import the Component

Import the component to your **index.ts** file as a normal ECMA-Script module, so it gets registered globally in the application.

``` ts
// index.ts
import '@3mo/model'
// ...
import './components/HelloWorld'
```

## 4. Extend TypeScript's HTMLElementTagNameMap interface

`HTMLElementTagNameMap` is, as the name suggest, the map between html tag names and the associated classes. Registering it correctly enables lit-analyser to type-check your element when it is used in other HTML templates

## 5. Consume the Component

The HTML tag the MoDeL components get registered against its html tag and can be used everywhere in HTML, as if it were a native element which browser knows about.


```ts
// HelloWorld.ts
import { Component, component, html } from '@3mo/model/library'

@component('sample-hello-world')
export class HelloWorld extends Component {
	protected render = () => html`
		<style>
			h1 {
				color: var(--mo-accent);
			}
		</style>

		<h1>Hello Fancy World</h1>
	`
}

declare global {
	interface HTMLElementTagNameMap {
		'sample-hello-world': HelloWorld
	}
}
```

``` html
	<!-- PageHome.ts.html -->
	<h1>Hey There</h1>
	<sample-hello-world></sample-hello-world>
```