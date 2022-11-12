import { html, component, style } from '@a11d/lit'
import { PageEntities } from '.'
import { ContextMenuHost } from '../../shell'

// TODO: Move to DataGridEntity

type Data = { id: number, name: string }
const data = new Array<Data>({ id: 5, name: 'Test' })
const fetchDataSpy = jasmine.createSpy().and.returnValue(Promise.resolve(data))
const createOrEditSpy = jasmine.createSpy()
const deleteSpy = jasmine.createSpy()

@component('mo-page-entities-test')
class PageTest extends PageEntities<Data> {
	protected createOrEdit = createOrEditSpy

	protected fetch = () => {
		fetchDataSpy(data)
		return Promise.resolve(data)
	}

	protected delete? = (data: Data) => { deleteSpy(data) }

	protected override get template() {
		return html`
			<mo-page heading='Settings page' fullHeight>
				<mo-group-box heading='Data' ${style({ height: '100%' })}>
					<mo-data-grid>
						<mo-data-grid-columns>
							<mo-data-grid-column-text heading='Name' dataSelector='name'></mo-data-grid-column-text>
						</mo-data-grid-columns>
						<mo-fab slot='fab' icon='add'></mo-fab>
					</mo-data-grid>
				</mo-group-box>
			</mo-page>
		`
	}
}

xdescribe('PageEntities', () => {
	const fixture = new ComponentTestFixture(() => new PageTest)

	it('should call createOrEdit passing the data when the context-menu-item "edit" is clicked', async () => {
		fetchDataSpy.calls.reset()
		createOrEditSpy.calls.reset()
		await fixture.component.renderRoot.querySelector('mo-data-grid')?.rows[0]?.openContextMenu()

		await ContextMenuHost.instance.items.find(i => i.getAttribute('data-test-id') === 'edit')?.click()

		expect(createOrEditSpy).toHaveBeenCalledOnceWith(data[0])
		expect(fetchDataSpy).toHaveBeenCalledTimes(1)
	})

	it('should call delete passing the data when the context-menu-item "delete" is clicked', async () => {
		fetchDataSpy.calls.reset()
		deleteSpy.calls.reset()
		await fixture.component.renderRoot.querySelector('mo-data-grid')?.rows[0]?.openContextMenu()

		await ContextMenuHost.instance.items.find(i => i.getAttribute('data-test-id') === 'delete')?.click()

		expect(deleteSpy).toHaveBeenCalledOnceWith(data[0])
		expect(fetchDataSpy).toHaveBeenCalledTimes(1)
	})

	it('should not render context-menu-item "delete" when delete method is undefined', async () => {
		fixture.component['delete'] = undefined
		await fixture.component.renderRoot.querySelector('mo-data-grid')?.rows[0]?.openContextMenu()

		expect(ContextMenuHost.instance.items.find(i => i.getAttribute('data-test-id') === 'delete')).not.toBeDefined()
	})

	it('should call createOrEdit when the fab is clicked', () => {
		createOrEditSpy.calls.reset()

		fixture.component.renderRoot.querySelector('mo-fab')?.click()

		expect(createOrEditSpy).toHaveBeenCalledOnceWith(undefined)
	})

	it('should call createOrEdit when a data-grid-row is clicked and "openDialogOnClick" is true', () => {
		// fixture.component['openDialogOnClick'] = true
		createOrEditSpy.calls.reset()
		const dataGrid = fixture.component.renderRoot.querySelector('mo-data-grid')

		dataGrid?.rowClick.dispatch(dataGrid.rows[0]!)

		expect(createOrEditSpy).toHaveBeenCalledOnceWith(dataGrid?.rows[0]?.data)
	})

	it('should not call createOrEdit when a data-grid-row is clicked and "openDialogOnClick" is false', () => {
		// fixture.component['openDialogOnClick'] = false
		createOrEditSpy.calls.reset()
		const dataGrid = fixture.component.renderRoot.querySelector('mo-data-grid')

		dataGrid?.rowClick.dispatch(dataGrid.rows[0]!)

		expect(createOrEditSpy).not.toHaveBeenCalledOnceWith(dataGrid?.rows[0]?.data)
	})
})