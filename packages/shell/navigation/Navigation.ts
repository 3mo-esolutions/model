import { MaterialIcon } from '@3mo/icon'
import { TemplateResult } from '@a11d/lit'
import { PageComponent, DialogComponent, RouteMatchMode } from '@a11d/lit-application'

export type Navigation = {
	label: string | TemplateResult
	icon?: MaterialIcon
	hidden?: boolean
	openInNewPage?: boolean
	component?: PageComponent<any> | DialogComponent<any, any>
	matchMode?: RouteMatchMode
	children?: Array<Navigation>
}