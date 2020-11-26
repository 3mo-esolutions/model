export const element = <T extends HTMLElement>(prototype: T, property: string) => {
	Object.defineProperty(prototype, property, {
		get: function () {
			return this.shadowRoot.getElementById(property)
		}
	})
}