import { TemplateResult, render } from 'lit-html'

export class TemplateHelper {
	static extractHTML(template: TemplateResult) {
		const div = document.createElement('div')
		render(template, div)
		const html = div.innerHTML
		div.remove()
		return html
	}

	static extractBySelector<K extends keyof HTMLElementTagNameMap>(template: TemplateResult, querySelector: K) {
		const div = document.createElement('div')
		render(template, div)
		const result = div.querySelector(querySelector)
		div.remove()
		return result as HTMLElementTagNameMap[K]
	}

	static extractAllBySelector<K extends keyof HTMLElementTagNameMap>(template: TemplateResult, querySelector: K) {
		const div = document.createElement('div')
		render(template, div)
		const result = Array.from(div.querySelectorAll(querySelector))
		div.remove()
		return result as Array<HTMLElementTagNameMap[K]>
	}
}