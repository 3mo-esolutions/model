export interface Manifest {
	name: string
	short_name: string
	long_name: string
	description: string
	// TODO [MIG]: what to to with these
	// release_notes: boolean
	// welcome_screen: boolean
	// forcesidebar_docked: boolean
	// version: string
	// versions: string[]
	feature_flags: Array<ManifestFeatureFlag>
	manifest_version: number
	start_url: string
	display: string
	background_color: string
	theme_color: string
	icons: ManifestIcon[]
}

export interface ManifestFeatureFlag {
	key: string
	name: string
	mandatory_from: string
}

export interface ManifestIcon {
	src: string
	sizes: string
	type: string
}