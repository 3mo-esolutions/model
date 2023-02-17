import { css } from '@a11d/lit'

export const styles = css`
	@import 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap';

	@font-face {
		font-family: 'Google Sans';
		font-style: normal;
		font-weight: 400;
		src: url(https://fonts.gstatic.com/s/productsans/v5/HYvgU2fE2nRJvZ5JFAumwegdm0LZdjqr5-oayXSOefg.woff2) format('woff2');
	}

	* {
		font-family: var(--mo-font-family);
		font-weight: 400;
		font-size: var(--mo-font-size-m);
		box-sizing: border-box;
	}

	html {
		width: 100%;
		height: 100%;
	}

	body {
		height: 100%;
		width: 100%;
		margin: 0;
		padding: 0;
		overflow: auto;
	}

	[application] {
		--mo-font-family: Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		--mo-border-radius: 4px;
		/* Duration */
		--mo-duration-instant: 0ms;
		--mo-duration-super-quick: 100ms;
		--mo-duration-quick: 250ms;
		--mo-duration-medium: 500ms;
		--mo-duration-slow: 1000ms;
		--mo-duration-super-slow: 1500ms;
		/* Shadows */
		--mo-shadow: rgba(var(--mo-shadow-base), .4) 0 1px 2px 0, rgba(var(--mo-shadow-base), .2) 0 1px 3px 1px !important;
		--mo-shadow-hover: rgba(var(--mo-shadow-base), .4) 0 5px 40px 0, rgba(var(--mo-shadow-base), .2) 0 5px 40px 1px !important;
		--mo-shadow-deep: 0px 5px 5px -3px rgba(var(--mo-shadow-base), 0.2), 0px 8px 10px 1px rgba(var(--mo-shadow-base), 0.14), 0px 3px 14px 2px rgba(var(--mo-shadow-base), 0.12);
		--mo-shadow-deep-hover: 0px 5px 5px -3px rgba(var(--mo-shadow-base), 0.2), 0px 8px 10px 1px rgba(var(--mo-shadow-base), 0.14), 0px 3px 14px 2px rgba(var(--mo-shadow-base), 0.12);
		/* Font Sizes */
		--mo-font-size-xxs: 8px;
		--mo-font-size-xs: 10px;
		--mo-font-size-s: 12px;
		--mo-font-size-m: 14px;
		--mo-font-size-l: 18px;
		--mo-font-size-xl: 24px;
		--mo-font-size-xxl: 36px;
		/* Thickness */
		--mo-thickness-xs: 2px;
		--mo-thickness-s: 4px;
		--mo-thickness-m: 6px;
		--mo-thickness-l: 8px;
		--mo-thickness-xl: 14px;
		--mo-thickness-xxl: 18px;
		/* Colors */
		--mo-color-error: rgb(var(--mo-color-error-base)) !important;
		--mo-color-on-surface: rgba(var(--mo-color-foreground-base), 0.87) !important;
		--mo-color-gray: rgb(var(--mo-color-gray-base)) !important;
		--mo-color-gray-transparent: rgba(var(--mo-color-gray-base), 0.5) !important;
		--mo-color-transparent-gray-alpha: .04;
		--mo-color-transparent-gray-1: rgba(var(--mo-color-foreground-base), calc(var(--mo-color-transparent-gray-alpha) * 1)); /* 4% */
		--mo-color-transparent-gray-2: rgba(var(--mo-color-foreground-base), calc(var(--mo-color-transparent-gray-alpha) * 2)); /* 8% */
		--mo-color-transparent-gray-3: rgba(var(--mo-color-foreground-base), calc(var(--mo-color-transparent-gray-alpha) * 3)); /* 12% */
		--mo-color-transparent-gray: var(--mo-color-transparent-gray-1);
		/* More info: https://css-tricks.com/css-variables-calc-rgb-enforcing-high-contrast-colors/ */
		/* TODO: Replace with @color-contrast when available: https://caniuse.com/mdn-css_types_color_color-contrast */
		--mo-color-accessible-base-value: calc(((((var(--mo-color-accent-base-r) * 299) + (var(--mo-color-accent-base-g) * 587) + (var(--mo-color-accent-base-b) * 114)) / 1000) - 128) * -1000);
		--mo-color-accessible-base: var(--mo-color-accessible-base-value), var(--mo-color-accessible-base-value), var(--mo-color-accessible-base-value);
		--mo-color-accessible: rgb(var(--mo-color-accessible-base));
		--mo-color-accent-base: var(--mo-color-accent-base-r), var(--mo-color-accent-base-g), var(--mo-color-accent-base-b);
		--mo-color-accent: rgb(var(--mo-color-accent-base));
		--mo-color-accent-transparent: rgba(var(--mo-color-accent-base), 0.25);
		--mo-color-accent-gradient: linear-gradient(135deg, rgb(var(--mo-color-accent-gradient-1)), rgb(var(--mo-color-accent-gradient-2)), rgb(var(--mo-color-accent-gradient-3)));
		--mo-color-accent-gradient-transparent: linear-gradient(135deg, rgba(var(--mo-color-accent-gradient-1), 0.25), rgba(var(--mo-color-accent-gradient-2), 0.25), rgba(var(--mo-color-accent-gradient-3), 0.25));
		--mo-color-surface: rgb(var(--mo-color-surface-base)) !important;
		/* Override Material Web Components variables */
		--mdc-icon-font: Material Icons Sharp !important;
		--mdc-theme-primary: var(--mo-color-accent) !important;
		--mdc-theme-on-primary: var(--mo-color-accessible) !important;
		--mdc-theme-secondary: var(--mo-color-accent) !important;
		--mdc-theme-on-secondary: var(--mo-color-accessible) !important;
		--mdc-theme-text-secondary-on-background: var(--mo-color-gray) !important;
		--mdc-theme-surface: var(--mo-color-surface) !important;
		--mdc-theme-text-primary-on-dark: var(--mo-color-surface) !important;
		--mdc-theme-on-surface: var(--mo-color-foreground-transparent) !important;
		--mdc-theme-text-disabled-on-light: var(--mo-color-gray-transparent) !important;
		--mdc-theme-text-hint-on-background: var(--mo-color-foreground-transparent) !important;
		--mdc-theme-text-icon-on-background: var(--mo-color-gray) !important;
		--mdc-theme-text-primary-on-background: var(--mo-color-foreground) !important;
	}

	[application][data-theme=light] {
		color-scheme: light;
		--mo-color-background-base: 255, 255, 255;
		--mo-color-foreground-base: 0, 0, 0;
		--mo-color-background: rgb(220, 221, 225) !important;
		--mo-color-foreground: black !important;
		--mo-color-foreground-transparent: rgb(48, 48, 48) !important;
		--mo-color-surface-base: 255, 255, 255;
		--mo-color-gray-base: 121, 121, 121;
		--mo-shadow-base: 95, 81, 78;
		--mo-color-error-base: 176, 0, 32;
		--mo-hover-background: rgba(0, 0, 0, .05);
		--mo-field-background: rgba(var(--mo-color-foreground-base), 0.09);
		--mo-field-menu-background: var(--mo-color-surface);
		--mo-field-menu-filter: brightness(0.91);
		--mo-alternating-background: rgba(var(--mo-color-foreground-base), 0.05);
	}

	[application][data-theme=dark] {
		color-scheme: dark;
		--mo-color-background-base: 0, 0, 0;
		--mo-color-foreground-base: 255, 255, 255;
		--mo-color-background: rgb(16, 17, 20) !important;
		--mo-color-surface-base: 42, 43, 47;
		--mo-color-foreground: white !important;
		--mo-color-foreground-transparent: rgb(220, 220, 220) !important;
		--mo-color-gray-base: 165, 165, 165;
		--mo-shadow-base: 0, 1, 3;
		--mo-color-error-base: 255, 61, 96;
		--mo-hover-background: rgba(255, 255, 255, .05);
		--mo-field-background: rgba(var(--mo-color-background-base), 0.5);
		--mo-field-menu-background: var(--mo-color-background);
		--mo-field-menu-filter: unset;
		--mo-alternating-background: rgba(var(--mo-color-background-base), 0.2);
	}
`