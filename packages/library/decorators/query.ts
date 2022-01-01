export const element = <T extends HTMLElement>(prototype: T, property: string) => {
	Object.defineProperty(prototype, property, {
		get: function (this: HTMLElement) {
			return this.shadowRoot?.getElementById(property) ?? undefined
		}
	})
}

export const query = (selector: string) => {
	return (prototype: HTMLElement, propertyKey: PropertyKey) => {
		Object.defineProperty(prototype, propertyKey, {
			get: function (this: HTMLElement) {
				return this.shadowRoot?.querySelector(selector) ?? undefined
			}
		})
	}
}

export const queryAll = (selector: string) => {
	return (prototype: HTMLElement, propertyKey: PropertyKey) => {
		Object.defineProperty(prototype, propertyKey, {
			get: function (this: HTMLElement) {
				return Array.from(this.shadowRoot?.querySelectorAll(selector) ?? [])
			}
		})
	}
}