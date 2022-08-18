import { component, html, FieldFetchableSelect } from '@3mo/model'
import { Album, AlbumService } from '../../sdk'

@component('app-field-select-album')
export class FieldSelectAlbum extends FieldFetchableSelect<Album> {
	override label = 'Album'

	protected override fetchData() {
		return AlbumService.getAll()
	}

	protected override getOptionTemplate(album: Album) {
		return html`<mo-option .data=${album} value=${album.id}>${album.title}</mo-option>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-field-select-album': FieldSelectAlbum
	}
}