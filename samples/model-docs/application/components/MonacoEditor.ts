import { Component, component, html, property, query } from '@3mo/model'

export const enum MonacoEditorLanguage {
	TypeScript = 'typescript',
	HTML = 'html',
	Markdown = 'markdown',
	JSON = 'json'
}

@component('doc-monaco-editor')
export class MonacoEditor extends Component {
	@property({
		updated(this: MonacoEditor) {
			if (this.editor) {
				this.editor.value = this.value
			}
		}
	}) value!: string
	@property() language!: string

	protected initialized() {
		this.iframeMain.onload = () => {
			if (!this.editor)
				return

			this.fixEditorHeight()
			this.editor.value = this.value
		}
	}

	get editor() {
		return this.iframeMain.contentDocument?.querySelector<MonacoEditorElement>('wc-monaco-editor') ?? undefined
	}

	@query('iframe') private readonly iframeMain!: HTMLIFrameElement

	protected override get template() {
		return html`
			<style>
				:host {
					position: relative;
					display: flex;
				}

				iframe {
					overflow: hidden;
					width: 100%;
					height: 100%;
				}
			</style>
			<iframe frameBorder="0" scrolling="no" srcdoc=${this.iframeContent}></iframe>
		`
	}

	private get iframeContent() {
		return `
			<!DOCTYPE html>
			<html main="true">
				<head>
					<script type="module" src="https://unpkg.com/@vanillawc/wc-monaco-editor@latest"></script>
					<style>
						wc-monaco-editor, body, html {
							position: absolute;
							height: 100%;
							width: 100%;
							margin: 0;
							padding: 0;
						}
					</style>
				</head>

				<body>
					<wc-monaco-editor language="${this.language}" tab-size="4" no-minimap>
					</wc-monaco-editor>
				</body>
			</html>
		`
	}

	async fixEditorHeight() {
		if (!this.editor)
			return

		await Promise.sleep(1000)

		const viewLinesElement = this.editor.querySelector('.view-lines') as HTMLElement
		this.style.height = (viewLinesElement.offsetHeight - 120) + 'px'
	}
}

interface MonacoEditorElement extends HTMLElement {
	value: string
	language: MonacoEditorLanguage
}

declare global {
	interface HTMLElementTagNameMap {
		'doc-monaco-editor': MonacoEditor
	}
}