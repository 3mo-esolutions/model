import { Album, ApiClient } from 'sdk'

export default new class AlbumService {
	getAll = () => ApiClient.get<Array<Album>>('/albums')
	get = (id: number) => ApiClient.get<Album>(`/album/${id}`)
}