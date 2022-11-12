/* eslint-disable @typescript-eslint/no-unused-vars */

HTMLElement.prototype.switchAttribute = function (attribute: string, value: boolean) {
	if (value === false) {
		this.removeAttribute(attribute)
	} else {
		this.setAttribute(attribute, '')
	}
}

HTMLElement.prototype.removeChildren = function () {
	Array.from(this.children).forEach(child => child.remove())
}

interface HTMLElement {
	switchAttribute(attribute: string, value: boolean): void
	removeChildren(): void
}