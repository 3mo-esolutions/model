import { component, css, html, state, style } from '../../library'
import { LocalStorageEntry } from '../../utilities'
import { DialogComponent } from '../../shell'
import { Marked } from '@ts-stack/markdown'

@component('mo-dialog-release-notes')
export class DialogReleaseNotes extends DialogComponent {
	private static readonly shownReleaseNoteVersion = new LocalStorageEntry('MoDeL.ReleaseNotes.ShownVersion', '')

	@state() notes = !this.extractReleaseNotes() ? undefined : Marked.parse(this.extractReleaseNotes()!)

	override confirm(...parameters: Parameters<DialogComponent['confirm']>) {
		if (!Changelog || !Manifest?.version || DialogReleaseNotes.shownReleaseNoteVersion.value === Manifest.version) {
			return Promise.resolve()
		}
		DialogReleaseNotes.shownReleaseNoteVersion.value = Manifest.version
		return super.confirm(...parameters)
	}

	static override get styles() {
		return css`
			ul {
				margin: 0;
				font-weight: 400;
				font-size: var(--mo-font-size-m);
				line-height: var(--mo-elm-height-xxs);
			}

			h1, h2, h3 {
				font-weight: 400;
				color: var(--mo-color-accent);
			}

			h1, h2, h3 {
				font-size: var(--mo-font-size-xl);
				margin-bottom: 0.5em;
			}

			a {
				color: var(--mo-color-accent);
				color: var(--mo-color-gray);
			}
		`
	}

	protected override get template() {
		return html`
			<mo-dialog heading=${this.extractVersionHeading()}>
				<mo-flex ${style({ padding: '0 var(--mo-thickness-l)', minHeight: '200px', minWidth: '400px' })} .innerHTML=${this.notes}></mo-flex>
			</mo-dialog>
		`
	}

	private extractReleaseNotes(version = Manifest?.version) {
		return this.extractVersionChangelog(version)[1]?.trim()
	}

	/**
	 * Converts standard-version heading to 3MO version format. e.g.
	 * `## [0.3.1](https://www.github.com/3mo-esolutions/ebusiness-client/compare/v0.3.0...v0.3.1) - January 2021`
	 * will be converted to `January 2021 - v0.3.1`
	 */
	private extractVersionHeading(version = Manifest?.version) {
		const versionChangelog = this.extractVersionChangelog(version)
		const htmlContent = Marked.parse(versionChangelog[0]!.split(versionChangelog[1]!)[0]!)
		const div = document.createElement('div')
		div.innerHTML = htmlContent
		const versionHeading = div.textContent?.split('-').reverse().join('- v')
		div.remove()
		return versionHeading ?? ''
	}

	private extractVersionChangelog(version = Manifest?.version) {
		version = version?.replace(/^v/, '')
		const regExp = new RegExp(
			`## v?\\[?${version}[^\\n]*\\n(.*?)(\\n##\\s|\\n### \\[?[0-9]+\\.|($(?![\r\n])))`,
			'ms'
		)
		const match = Changelog?.match(regExp)

		if (!match) {
			throw new Error(`Could not find release notes for provided version ${version}`)
		}

		return match as RegExpMatchArray
	}
}

globalThis.Changelog = globalThis.Changelog || undefined

declare global {
	// Defined via Webpack DefinePlugin
	// eslint-disable-next-line
	var Changelog: string | undefined
}