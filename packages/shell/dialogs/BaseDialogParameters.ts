import { TemplateResult } from '../../library'
import { DialogSize } from '..'

export type BaseDialogParameters = {
	readonly heading: string
	readonly content?: string | TemplateResult
	readonly primaryButtonText?: string
	readonly blocking?: boolean
	readonly size?: DialogSize
}