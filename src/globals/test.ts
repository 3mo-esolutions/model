import { Component } from '../library'

async function initialize<TComponent extends Component>(component: TComponent) {
	document.body.appendChild(component)
	await component.updateComplete
	return component
}

globalThis.initializeTestComponent = initialize

declare global {
	// eslint-disable-next-line no-var
	var initializeTestComponent: typeof initialize
}