import { TemplateResult } from '@a11d/lit'
import { MaterialDialogSize } from '..'

export type BaseDialogParameters = {
	readonly heading: string
	readonly content?: string | TemplateResult
	readonly primaryButtonText?: string
	readonly blocking?: boolean
	readonly size?: MaterialDialogSize
}