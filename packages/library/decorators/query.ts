export const element = <T extends HTMLElement>(prototype: T, property: string) => {
	Object.defineProperty(prototype, property, {
		get: function () {
			return this.shadowRoot.getElementById(property)
		}
	})
}

export const query = (selector: string) => {
	return (prototype: HTMLElement, propertyKey: PropertyKey) => {
		Object.defineProperty(prototype, propertyKey, {
			get: function () {
				return this.shadowRoot.querySelector(selector)
			}
		})
	}
}

export const queryAll = (selector: string) => {
	return (prototype: HTMLElement, propertyKey: PropertyKey) => {
		Object.defineProperty(prototype, propertyKey, {
			get: function () {
				return Array.from(this.shadowRoot.querySelectorAll(selector))
			}
		})
	}
}