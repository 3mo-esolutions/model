HTMLElement.prototype.clone = function <T extends HTMLElement>() {
	const cloned = this.cloneNode(true) as T
	this.eventHandlers.forEach(ev => cloned.addEventListener(ev.name, ev.eventListener))
	return cloned as T
}

interface HTMLElement {
	clone<T extends HTMLElement>(): T
}