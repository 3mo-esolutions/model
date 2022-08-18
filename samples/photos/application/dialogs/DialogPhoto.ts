import { component, DialogComponent, html, state } from '@3mo/model'
import { Album, ApiClient, Photo, User } from '../../sdk'

@component('photos-photo-details-dialog')
export class DialogPhoto extends DialogComponent<{ readonly photo: Photo }> {
	@state() private album?: Album
	@state() private photographer?: User

	protected override async initialized() {
		this.album = await ApiClient.get<Album>(`/albums/${this.parameters.photo.albumId}`)
		this.photographer = await ApiClient.get(`/users/${this.album.userId}`)
	}

	protected override get template() {
		return html`
			<mo-dialog heading=${this.parameters.photo.title}>
				<style>
					img {
						border-radius: 50%;
						width: 100%;
					}
				</style>
				<mo-flex direction='horizontal' gap='var(--mo-thickness-xxl)'>
					<mo-flex justifyContent='center'>
						<img src=${this.parameters.photo.thumbnailUrl} alt=${this.parameters.photo.title}>
					</mo-flex>
					<mo-flex gap='var(--mo-thickness-xl)'>
						<mo-meta heading='Album'>${this.album?.title}</mo-meta>
						<mo-meta heading='Photographer'>
							${this.photographer?.name}
							<br>
							@${this.photographer?.username}
						</mo-meta>
						<mo-meta heading='Company'>${this.photographer?.company.name}</mo-meta>
					</mo-flex>
				</mo-flex>
			</mo-dialog>
		`
	}
}