export type Manifest = {
	name: string
	short_name: string
	description: string
	start_url: string
	display: string
	background_color: string
	theme_color: string
	icons: Array<ManifestIcon>
}

export type ManifestIcon = {
	src: string
	sizes: string
	type: string
}