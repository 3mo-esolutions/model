import { HTMLTemplateResult } from '../../../library'

export type ColumnDefinition<TData, TValue = unknown> = {
	heading: string
	title?: string
	dataSelector: KeyPathOf<TData>
	width?: string
	alignment?: 'left' | 'center' | 'right'
	hidden?: boolean
	sortable?: boolean
	editable?: boolean
	sumHeading?: string
	getContentTemplate?(value: TValue, data: TData): HTMLTemplateResult
	getEditContentTemplate?(value: TValue, data: TData): HTMLTemplateResult
	getSumTemplate?(sum: number): HTMLTemplateResult
}