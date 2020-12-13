export interface Manifest {
	name: string
	short_name: string
	long_name: string
	description: string
	version: string
	versions: Array<string>
	feature_flags: Array<ManifestFeatureFlag>
	manifest_version: number
	start_url: string
	display: string
	background_color: string
	theme_color: string
	icons: Array<ManifestIcon>
}

export interface ManifestFeatureFlag {
	key: keyof MoDeL.FeatureFlags
	name: string
	mandatory_from: string
}

export interface ManifestIcon {
	src: string
	sizes: string
	type: string
}