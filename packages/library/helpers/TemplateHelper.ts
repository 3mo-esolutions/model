import { TemplateResult, render } from 'lit'

export class TemplateHelper {
	private static readonly div = document.createElement('div')

	static extractHTML(template: TemplateResult) {
		return this.renderAndExtract(template, div => div.innerHTML)
	}

	static extractBySelector<K extends keyof HTMLElementTagNameMap>(template: TemplateResult, querySelector: K) {
		return this.renderAndExtract(template, div => div.querySelector(querySelector)!)
	}

	static extractAllBySelector<K extends keyof HTMLElementTagNameMap>(template: TemplateResult, querySelector: K) {
		return this.renderAndExtract(template, div => [...div.querySelectorAll(querySelector)])
	}

	private static renderAndExtract<T>(template: TemplateResult, extractor: (div: HTMLElement) => T) {
		this.div.innerHTML = ''
		render(template, this.div)
		return extractor(this.div)
	}
}