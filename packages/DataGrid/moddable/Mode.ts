import { FetchableDataGridParametersType, ColumnDefinition, DataGridPagination, DataGridSorting } from '..'

export class Mode<TData, TDataFetcherParameters extends FetchableDataGridParametersType> {
	name!: string
	id? = generateId()
	isArchived = false
	columns?: Array<ColumnDefinition<TData>>
	sorting?: DataGridSorting<TData>
	pagination?: DataGridPagination
	parameters?: TDataFetcherParameters

	constructor(mode?: Partial<Mode<TData, TDataFetcherParameters>>) {
		if (mode) {
			Object.assign(this, mode)
		}
	}
}

function generateId() {
	return Math.floor(Math.random() * Date.now())
}