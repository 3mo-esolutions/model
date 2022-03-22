import { component, Component, css, TopAppBar } from '@3mo/model'
import { Marked } from '@ts-stack/markdown'
import { GitHubHelper } from '../helpers'
import { MonacoEditor, MonacoEditorLanguage } from '.'

@component('doc-markdown')
export class Markdown extends Component {
	static override get styles() {
		return css`
			:host {
				line-height: 150%;
				padding: 0 1rem;
				font-size: 14px;
				width: calc(100% - 2em);
				--do-rgb: 22, 175, 22;
				--caution-rgb: 255, 193, 8;
				--dont-rgb: 240, 58, 23;
				--info-rgb: 0, 120, 215;
			}

			p,
			pre,
			blockquote,
			table {
				margin: 16px 0 0 0;
			}

			pre {
				background: var(--mo-background) !important;
				font-family: 'Fira Code Light', monospace;
			}

			code {
				font-weight: bolder;
				font-family: 'Fira Code Light', monospace;
				background: var(--mo-accent-gradient-transparent);
				padding: 2px 4px;
			}

			a,
			a:visited {
				text-decoration: none;
				border-bottom: var(--mo-accent) 2px dashed;
				color: unset;
			}

			img {
				max-width: 75%;
				max-height: 400px;
			}

			strong {
				font-weight: 900;
				color: var(--mo-accent);
			}

			table {
				border-collapse: collapse;
			}

			td,
			th {
				border-bottom: 1px solid var(--mo-gray-transparent);
			}

			td:not(:first-child),
			td:not(:last-child) {
				padding: 0.5rem;
			}

			td:first-child {
				padding: 0.5rem 0.5rem 0.5rem 0;
			}

			td:last-child {
				padding: 0.5rem 0 0.5rem 0.5rem;
			}

			h1,
			h2,
			h3 {
				font-family: Google Sans;
				font-weight: 500;
				color: var(--mo-accent);
				line-height: 150%;
			}

			h1:nth-of-type(1) {
				margin-top: 18px;
			}

			h1 {
				margin: 36px 0 18px 0;
				font-size: xx-large;
			}

			h2 {
				margin: 24px 0 12px 0;
				font-size: x-large;
			}

			h3 {
				margin: 16px 0 8px 0;
				font-size: large;
			}

			blockquote {
				padding: 1em;
				border-radius: 6px;
			}

			blockquote::before {
				font-size: 16px;
				display: block;
				margin-bottom: 10px;
				font-family: apple color emoji, segoe ui emoji, noto color emoji, android emoji, emojisymbols, emojione mozilla, twemoji mozilla, segoe ui symbol;
				font-weight: 800;
			}

			blockquote p {
				padding: 0;
				font-size: 16px;
			}

			blockquote.do {
				background-color: rgba(var(--do-rgb), 0.25);
			}

			blockquote.do::before {
				content: '✔️ DO';
				color: rgb(var(--do-rgb));
			}

			blockquote.caution {
				background-color: rgba(var(--caution-rgb), 0.25);
			}

			blockquote.caution::before {
				content: '⚠️ CAUTION';
				color: rgb(var(--caution-rgb));
			}

			blockquote.dont {
				background-color: rgba(var(--dont-rgb), 0.25);
			}

			blockquote.dont::before {
				content: "❌ DON'T";
				color: rgb(var(--dont-rgb));
			}

			blockquote.note {
				background: rgba(var(--info-rgb), 0.25);
			}

			blockquote.note::before {
				content: 'ℹ INFO';
				color: rgb(var(--info-rgb));
			}
		`
	}

	private static readonly quoteMap = {
		'✔': 'do',
		'⚠': 'caution',
		'❌': 'dont',
		'ℹ': 'note'
	}

	private _value = ''
	get value() { return this._value }
	set value(value) {
		this.shadowRoot.innerHTML += Marked.parse(value)

		const pageTitle = this.shadowRoot.querySelector('h1')?.textContent ?? ''
		TopAppBar.title = pageTitle
		document.title = `3MO MoDeL | ${pageTitle}`

		this.shadowRoot.querySelectorAll('blockquote').forEach(quote => {
			if (quote.firstElementChild) {
				// @ts-ignore first character of the text is always one of the quoteMapper keys
				quote.className = Markdown.quoteMap[quote.firstElementChild.innerHTML.charAt(0)]
				quote.firstElementChild.innerHTML = quote.firstElementChild.innerHTML.slice(1)
			}
		})

		this.shadowRoot.querySelectorAll('pre').forEach(pre => {
			const codeElement = pre.querySelector('code') as HTMLElement
			codeElement.style.display = 'none'
			const languageInline = codeElement.className.split('lang-')[1]
			const language = languageInline === 'ts' ? MonacoEditorLanguage.TypeScript : languageInline as MonacoEditorLanguage
			const codeRaw = codeElement.innerText
			fetchCode(codeRaw, language).then(code => {
				const monacoEditorElement = new MonacoEditor()
				monacoEditorElement.language = language
				monacoEditorElement.value = code
				pre.appendChild(monacoEditorElement)
			})
		})

		this._value = value
	}
}

async function fetchCode(code: string, language: MonacoEditorLanguage) {
	const firstLine = code.split('\n')[0]
	if (firstLine.includes('file:')) {
		const filePath = firstLine.split('"')[1]
		const fileName = filePath.split('/')[filePath.split('/').length - 1]
		const comment = language === MonacoEditorLanguage.HTML ? `<!-- ${fileName} -->` : `// ${fileName}`
		code = `${comment}\n${await GitHubHelper.fetch(filePath)}`
	}
	return code
}

declare global {
	interface HTMLElementTagNameMap {
		'doc-markdown': Markdown
	}
}