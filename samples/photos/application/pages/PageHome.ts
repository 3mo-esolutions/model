import { component, html, PageComponent, homePage, route } from '@3mo/model'

@homePage
@route('/home')
@component('sample-page-home')
export class PageHome extends PageComponent {
	protected override render = () => html`
		<mo-page header='Home' fullHeight>
			<style>
				h1 {
					color: var(--mo-accent);
					font-weight: 500;
				}
			</style>
			<mo-card style='--mo-shadow: none;' height='calc(100% - 200px)' width='calc(100% - 200px)' margin='100px'>
				<mo-flex background='var(--mo-color-gray-alpha-1)' width='*' alignItems='center' justifyContent='center'>
					Box 1
					<mo-flex width='100%' background='var(--mo-color-gray-alpha-1)' alignItems='center' justifyContent='center'>
						Box 2
						<mo-flex width='100%' background='var(--mo-color-gray-alpha-1)' alignItems='center' justifyContent='center'>
							Box 3
						</mo-flex>
					</mo-flex>
				</mo-flex>
				<mo-icon-button foreground='var(--mo-color-gray)' icon='launch'></mo-icon-button>
				<mo-flex alignItems='center' justifyContent='center' height='*' gap='var(--mo-thickness-xl)'>
					<mo-field-text dense label='Aaaaa'></mo-field-text>
					<mo-field-text label='Bbbb'></mo-field-text>
					<mo-field-select label='Ccccc'>
						<mo-option>Ccccc - A</mo-option>
						<mo-option>Ccccc - B</mo-option>
						<mo-option>Ccccc - C</mo-option>
					</mo-field-select>
				</mo-flex>
				<mo-flex gap='var(--mo-thickness-m)' fontSize='50px'>
					Welcome to 3MO Design Library
				</mo-flex>
			</mo-card>
		</mo-page>
	`
}