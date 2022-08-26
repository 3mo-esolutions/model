import { PageComponent, component, html, route, state, ContextMenuHost, cache, homePage, style } from '@3mo/model'
import { Photo, PhotoService } from '../../sdk'

const enum Tab {
	Card = 'card',
	DataGrid = 'dataGrid',
}

@homePage()
@route('/home(/:albumId)')
@component('photos-page-home')
export class PageHome extends PageComponent<{ readonly albumId?: number }> {
	@state() private photos = new Array<Photo>()
	@state() private selectedPhotos = new Array<Photo>()
	@state() private tab = Tab.DataGrid
	@state() private dataGridParameters: FirstParameter<typeof PhotoService.getAll> = {}

	protected override get template() {
		return html`
			<mo-page heading='Startseite' fullHeight>
				<style>
					mo-card {
						min-height: 100px;
						min-width: 100px;
					}

					mo-card::part(header) {
						text-align: center;
					}
				</style>

				<mo-tab-bar slot='pageHeadingDetails' value=${this.tab} @navigate=${(e: CustomEvent<Tab>) => this.tab = e.detail}>
					<mo-tab value=${Tab.Card}>Card</mo-tab>
					<mo-tab value=${Tab.DataGrid}>DataGrid</mo-tab>
				</mo-tab-bar>

				${cache(this.tab === Tab.Card ? this.cardTemplate : this.dataGridTemplate)}
			</mo-page>
		`
	}

	private get cardTemplate() {
		return html`
			<mo-flex direction='horizontal' height='40px' alignItems='center'>
				<mo-heading typography='heading4' ${style({ color: 'var(--mo-accent)', width: '*' })}>${this.selectedPhotos.length > 0 ? `${this.selectedPhotos.length} Photo${this.selectedPhotos.length > 1 ? 's' : ''} selected` : 'Photos'}</mo-heading>
				<mo-icon-button icon='edit' ?hidden=${this.selectedPhotos.length === 0}></mo-icon-button>
				<mo-icon-button icon='delete' ?hidden=${this.selectedPhotos.length === 0}></mo-icon-button>
			</mo-flex>
			<mo-grid columns='repeat(auto-fit, minmax(200px, 1fr))' gap='var(--mo-thickness-m)'>
				${this.photos.filter(photo => !this.parameters.albumId || photo.albumId === this.parameters.albumId).slice(0, 50).map(photo => html`
					<photos-photo-card
						.photo=${photo}
						?selected=${this.selectedPhotos.includes(photo)}
						@contextmenu=${(e: MouseEvent) => ContextMenuHost.open(e, this.contextMenuTemplate)}
						@selectionChange=${(event: CustomEvent<boolean>) => this.updateSelectedPhotos(event.detail, photo)}
					></photos-photo-card>
				`)}
			</mo-grid>
		`
	}

	private get dataGridTemplate() {
		return html`
			<mo-flex>
				<photos-data-grid-photo selectionMode='multiple' selectOnClick multipleDetails
					.parameters=${this.dataGridParameters}
					.selectedData=${this.selectedPhotos}
					@dataChange=${(event: CustomEvent<Array<Photo>>) => this.photos = event.detail}
					@selectionChange=${(event: CustomEvent<Array<Photo>>) => this.selectedPhotos = event.detail}
					@parametersChange=${(event: CustomEvent<FirstParameter<typeof PhotoService.getAll>>) => this.dataGridParameters = event.detail}
				>
					<app-field-select-album multiple slot='toolbar' default='All'
						.value=${this.dataGridParameters.albumIds}
						@change=${(event: CustomEvent<Array<number>>) => this.dataGridParameters = { ...this.dataGridParameters, albumIds: event.detail }}>
					</app-field-select-album>

					<mo-fab slot='fab' icon='add'></mo-fab>
				</photos-data-grid-photo>
			</mo-flex>
		`
	}

	private get contextMenuTemplate() {
		return html`
			<mo-context-menu-item icon='edit'>Edit</mo-context-menu-item>
			<mo-context-menu-item icon='delete'>Delete</mo-context-menu-item>
		`
	}

	private readonly updateSelectedPhotos = (isSelected: boolean, photo: Photo) => {
		this.selectedPhotos = isSelected
			? [...this.selectedPhotos, photo]
			: this.selectedPhotos.filter(p => p !== photo)
	}
}