import { component, css, Component, html, property } from '../library'

export const enum HeadlineTypography {
	Headline1 = 'headline1',
	Headline2 = 'headline2',
	Headline3 = 'headline3',
	Headline4 = 'headline4',
	Headline5 = 'headline5',
	Headline6 = 'headline6',
	Subtitle1 = 'subtitle1',
	Subtitle2 = 'subtitle2',
}

@component('mo-headline')
export class Headline extends Component {
	@property({ reflect: true }) typography = HeadlineTypography.Headline3

	static override get styles() {
		return css`
			:host {
				display: block;
			}

			:host([typography=headline1]) {
				font-size: var(--mdc-typography-headline1-font-size, 2.5em);
				letter-spacing: -0.75px;
				font-weight: 300;
			}

			:host([typography=headline2]) {
				font-size: var(--mdc-typography-headline2-font-size, 2em);
				letter-spacing: -0.5px;
				font-weight: 300;
			}

			:host([typography=headline3]) {
				font-size: var(--mdc-typography-headline3-font-size, 1.8em);
				letter-spacing: -0.25px;
				font-weight: 400;
			}

			:host([typography=headline4]) {
				font-size: var(--mdc-typography-headline4-font-size, 1.5em);
				font-weight: 400;
			}

			:host([typography=headline5]) {
				font-size: var(--mdc-typography-headline5-font-size, 1.17em);
				font-weight: 500;
			}

			:host([typography=headline6]) {
				font-size: var(--mdc-typography-headline6-font-size, 1em);
				letter-spacing: 0.15px;
				font-weight: 500;
			}

			:host([typography=subtitle1]) {
				font-size: var(--mdc-typography-subtitle1-font-size, 1.15em);
				letter-spacing: 0.15px;
				font-weight: 400;
			}

			:host([typography=subtitle2]) {
				font-size: var(--mdc-typography-subtitle2-font-size, 1em);
				letter-spacing: 0.1px;
				font-weight: 400;
			}
		`
	}

	protected override get template() {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-headline': Headline
	}
}