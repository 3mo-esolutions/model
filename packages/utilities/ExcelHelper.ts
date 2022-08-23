import { Downloader } from '.'

export class ExcelHelper {
	static generate<TData>(
		data: Array<TData>,
		keys = Object.keys(data[0]!) as Array<KeyPathOf<TData>>,
		title = 'Export'
	) {
		const dataClone = data.map((data: TData) => {
			keys.forEach(key => {
				const value = getPropertyByKeyPath(data, key)
				setPropertyByKeyPath(data, key, value instanceof Date
					? isNaN(value.getTime()) ? '' : value.toISOString() as any
					: value
				)
			})
			return data
		})

		const csv = `${keys.join(',')}
			${dataClone.map(data => keys.map(selector => `"${getPropertyByKeyPath(data, selector)}"`).join(',')).join('\r\n')}
		`

		const fileName = Manifest.short_name + title.replace(/ /g, '_')
		Downloader.download(`data:text/csv;charset=utf-8,${escape(csv)}`, `${fileName}.csv`)
	}
}