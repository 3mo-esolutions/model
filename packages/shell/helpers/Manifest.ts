export type Manifest = {
	readonly version: string
	readonly name: string
	// eslint-disable-next-line
	readonly short_name: string
	readonly description: string
	// eslint-disable-next-line
	readonly start_url: string
	readonly display: string
	// eslint-disable-next-line
	readonly display_override?: Array<string>
	// eslint-disable-next-line
	readonly background_color: string
	// eslint-disable-next-line
	readonly theme_color: string
	readonly icons: Array<ManifestIcon>
}

export type ManifestIcon = {
	readonly src: string
	readonly sizes: string
	readonly type: string
}