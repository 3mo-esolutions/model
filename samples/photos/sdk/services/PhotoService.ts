import { Photo, ApiClient } from 'sdk'

export default new class PhotoService {
	private count = -1

	getAll = async (parameters: {
		albumIds?: Array<number>
		skip?: number
		take?: number
	}) => {
		this.count++
		const queryString = (parameters.albumIds?.map(id => `albumId=${id}`) ?? []).join('&')
		const result = await ApiClient.get<Array<Photo>>(`/photos?${queryString}&skip=${parameters.skip}&take=${parameters.take}`)
		await Promise.sleep(500)
		if (parameters.take !== undefined && parameters.skip !== undefined) {
			return {
				data: result.slice(parameters.skip, parameters.skip + parameters.take),
				dataLength: result.length,
				// hasNextPage: (parameters.skip + parameters.take) < result.length,
			}
		}
		// Simulate live data change
		return [...result.slice(0, this.count), ...result]
	}

	get = (id: number) => ApiClient.get<Photo>(`/photos/${id}`)
}