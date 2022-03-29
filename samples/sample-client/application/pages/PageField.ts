import { component, html, PageComponent, homePage, route } from '@3mo/model'

@homePage()
@route('/field')
@component('sample-page-field')
export class PageField extends PageComponent {
	protected override get template() {
		return html`
			<style>
				mo-section[heading], mo-card {
					margin-top: 2em;
				}
				mo-section[heading]:first-child {
					margin-top: 0;
				}
				.error{
					color: var(--mo-color-error);
				} 
			</style>
			<mo-page heading='Field' fullHeight>
				<mo-grid columnGap='var(--mo-thickness-xl)' rowGap='var(--mo-thickness-xl)' height='*' width='100%' columns='* *'>
					<mo-flex>
						<mo-card heading='Textfelder'>
							<mo-section gap='var(--mo-thickness-xl)' heading='Textfelder'>
								<mo-grid columns='repeat(5, *)' rows='auto' gap='var(--mo-thickness-l)'>
									<mo-field-text label="Text"></mo-field-text>
									<mo-field-text label="Text disabled" disabled></mo-field-text>
									<mo-field-text label="Text readonly" readonly></mo-field-text>
									<mo-field-text label="Text required" required></mo-field-text>
									<mo-field-text label="Nummer error" class='error'></mo-field-text>

									<mo-field-number label='Nummer'></mo-field-number>
									<mo-field-number label='Nummer disabled' disabled></mo-field-number>
									<mo-field-number label='Nummer readonly' readonly></mo-field-number>
									<mo-field-number label='Nummer required' required></mo-field-number>
									<mo-field-number label='Nummer error' error></mo-field-number>

									<mo-field-password label='Passwort'></mo-field-password>
									<mo-field-password label='Passwort disabled' disabled></mo-field-password>
									<mo-field-password label='Passwort readonly' readonly></mo-field-password>
									<mo-field-password label='Passwort required' required></mo-field-password>
									<mo-field-password label='Passwort error' error></mo-field-password>
								
								</mo-grid>
							</mo-section>

							<mo-section gap='var(--mo-thickness-xl)' heading='Textfelder mit Icons'>
								<mo-grid columns='repeat(3, *)' rows='auto' gap='var(--mo-thickness-l)'>
																		
									<mo-field-amount label='Betrag'></mo-field-amount>
									<mo-field-amount label='Betrag disabled' disabled></mo-field-amount>
									<mo-field-amount label='Betrag readonly' readonly></mo-field-amount>

									<mo-field-percentage label='Prozent'></mo-field-percentage>
									<mo-field-percentage label='Prozent disabled' disabled></mo-field-percentage>
									<mo-field-percentage label='Prozent readonly' readonly></mo-field-percentage>

									<mo-field-date label='Datum'></mo-field-date>
									<mo-field-date label='Datum disabled' disabled></mo-field-date>
									<mo-field-date label='Datum readonly' readonly></mo-field-date>

									<mo-field-text label="Text slot trailing">
										<span slot='trailing'>cm</span>
									</mo-field-text>
									<mo-field-text label="Text slot trailing disabled" disabled>
										<span slot='trailing'>cm</span>
									</mo-field-text>
									<mo-field-text label="Text slot trailing readonly" readonly>
										<span slot='trailing'>cm</span>
									</mo-field-text>

									<mo-field-search label="Suche"></mo-field-search>
									<mo-field-search label="Suche disabled" disabled></mo-field-search>
									<mo-field-search label="Suche" readonly></mo-field-search>

									<mo-field-text label="Text slot leading">
										<span slot='leading'><mo-icon icon='person_add'></mo-icon></span>
									</mo-field-text>
									<mo-field-text label="Text slot leading disabled" disabled>
										<span slot='leading'><mo-icon icon='person_add'></mo-icon></span>
									</mo-field-text>
									<mo-field-text label="Text slot leading readonly" readonly>
										<span slot='leading'><mo-icon icon='person_add'></mo-icon></span>
									</mo-field-text>

									<mo-field-text label="Counter" counter='50'></mo-field-text>
									<mo-field-text label="Counter disabled" counter='50' disabled></mo-field-text>
									<mo-field-text label="Counter readonly" counter='50' readonly></mo-field-text>

									<mo-field-text label="Text slot leading trailing">
										<span slot='leading'><mo-icon icon='person_add'></mo-icon></span>
										<span slot='trailing'><mo-icon icon='cancel'></mo-icon></span>
									</mo-field-text>
									<mo-field-text label="Text slot leading trailing disabled" disabled>
										<span slot='leading'><mo-icon icon='person_add'></mo-icon></span>
										<span slot='trailing'><mo-icon-button icon='cancel'></mo-icon-button></span>
									</mo-field-text>
									<mo-field-text label="Text slot leading trailing readonly" readonly>
										<span slot='leading'><mo-icon icon='person_add'></mo-icon></span>
										<span slot='trailing'><mo-icon-button icon='cancel'></mo-icon-button></span>
									</mo-field-text>

									<mo-field-text label="Text slot leading trailing trailingInternal">
										<span slot='leading'><mo-icon icon='person_add'></mo-icon></span>
										<span slot='trailing'><mo-icon-button icon='cancel'></mo-icon-button></span>
										<span slot='trailingInternal'><mo-icon-button icon='person_add'></mo-icon-button></span>
									</mo-field-text>
									<mo-field-text label="Text slot leading trailing trailingInternal disabled" disabled>
										<span slot='leading'><mo-icon icon='person_add'></mo-icon></span>
										<span slot='trailing'><mo-icon icon='cancel'></mo-icon></span>
										<span slot='trailingInternal'><mo-icon icon='person_add'></mo-icon></span>
									</mo-field-text>
									<mo-field-text label="Text slot leading trailing trailingInternal readonly" readonly>
										<span slot='leading'><mo-icon icon='person_add'></mo-icon></span>
										<span slot='trailing'><mo-icon icon='cancel'></mo-icon></span>
										<span slot='trailingInternal'><mo-icon icon='person_add'></mo-icon></span>
									</mo-field-text>

									<mo-field-text label="Text slot trailing trailingInternal">
										<span slot='trailing'><mo-icon icon='cancel'></mo-icon></span>
										<span slot='trailingInternal'><mo-icon icon='person_add'></mo-icon></span>
									</mo-field-text>
									<mo-field-text label="Text slot trailing trailingInternal disabled" disabled>
										<span slot='trailing'><mo-icon icon='cancel'></mo-icon></span>
										<span slot='trailingInternal'><mo-icon icon='person_add'></mo-icon></span>
									</mo-field-text>
									<mo-field-text label="Text slot trailing trailingInternal readonly" readonly>
										<span slot='trailing'><mo-icon icon='cancel'></mo-icon></span>
										<span slot='trailingInternal'><mo-icon icon='person_add'></mo-icon></span>
									</mo-field-text>

									
								</mo-grid>
							</mo-section>

							<mo-section gap='var(--mo-thickness-xl)' heading='Textfelder Dense'>
								<mo-grid columns='repeat(4, *)' rows='auto' gap='var(--mo-thickness-l)'>
									<mo-field-text label="Text" dense></mo-field-text>
									<mo-field-text label="Text disabled" disabled dense></mo-field-text>
									<mo-field-text label="Text readonly" readonly dense></mo-field-text>
									<mo-field-text label="Text required" required dense></mo-field-text>
									<mo-field-text label="Nummer error" error dense></mo-field-text>

									<mo-field-number label='Nummer' dense></mo-field-number>
									<mo-field-number label='Nummer disabled' disabled dense></mo-field-number>
									<mo-field-number label='Nummer readonly' readonly dense></mo-field-number>
									<mo-field-number label='Nummer required' required dense></mo-field-number>
									<mo-field-number label='Nummer error' error dense></mo-field-number>

									<mo-field-password label='Passwort' dense></mo-field-password>
									<mo-field-password label='Passwort disabled' disabled dense></mo-field-password>
									<mo-field-password label='Passwort readonly' readonly dense></mo-field-password>
									<mo-field-password label='Passwort required' required dense></mo-field-password>
									<mo-field-password label='Passwort error' error dense></mo-field-password>
									
								</mo-grid>
							</mo-section>
						</mo-card>
						<!--
						<mo-card heading='Listen'>
							<mo-section gap='var(--mo-thickness-xl)' heading='Listen'>
								<mo-list>
									<mo-list-item>List Item</mo-list-item>
									<mo-list-item>List Item</mo-list-item>
								</mo-list>
								 War ausgeklammert: <mo-grid columns='repeat(4, 95px)' rows='auto' columnGap='var(--mo-thickness-xl)'>
								</mo-grid>
							</mo-section>
							<mo-context-menu-host>
								<mo-context-menu>
									<mo-context-menu-item>Löschen</mo-context-menu-item>
								</mo-context-menu>
							</mo-context-menu-host>
						</mo-card>
			-->
					</mo-flex>
					<mo-flex>
						<mo-card heading='Selects'>
							<mo-section gap='var(--mo-thickness-xl)' heading='Select'>
								<mo-grid columns='repeat(3, *)' rows='auto' gap='var(--mo-thickness-l)'>						
									<mo-field-select label="Selectlabel slot leading trailing">
										<span slot='leading'><mo-icon icon='person_add'></mo-icon></span>
										<span slot='trailing'><mo-icon icon='cancel'></mo-icon></span>
										<mo-option>option 1</mo-option>
										<mo-option>option 2</mo-option>
									</mo-field-select>
									<mo-field-select label="Disabled" disabled>
										<span slot='leading'><mo-icon icon='person_add'></mo-icon></span>
										<span slot='trailing'><mo-icon icon='cancel'></mo-icon></span>
										<mo-option>option 1</mo-option>
										<mo-option>option 2</mo-option>
									</mo-field-select>
									<mo-field-select label="Readonly" readonly>
										<span slot='leading'><mo-icon icon='person_add'></mo-icon></span>
										<span slot='trailing'><mo-icon icon='cancel'></mo-icon></span>
										<mo-option>option 1</mo-option>
										<mo-option>option 2</mo-option>
									</mo-field-select>

									<mo-field-select label="Selectlabel">
										<mo-option>option 1</mo-option>
										<mo-option>option 2</mo-option>
									</mo-field-select>
									<mo-field-select label="Disabled" disabled>
										<mo-option>option 1</mo-option>
										<mo-option>option 2</mo-option>
									</mo-field-select>
									<mo-field-select label="Readonly" readonly>
										<mo-option>option 1</mo-option>
										<mo-option>option 2</mo-option>
									</mo-field-select>

									<mo-field-select multiple label='Multiple'>
										<mo-option>Manuelle</mo-option>
										<mo-option>Vorschläge</mo-option>
										<mo-option>Automatisch</mo-option>
										<mo-option>Option</mo-option>
										<mo-option>Option</mo-option>
									</mo-field-select>
									<mo-field-select multiple label='Multiple disabled' disabled>
										<mo-option>Manuelle</mo-option>
										<mo-option>Vorschläge</mo-option>
										<mo-option>Automatisch</mo-option>
										<mo-option>Option</mo-option>
										<mo-option>Option</mo-option>
									</mo-field-select>
									<mo-field-select multiple label='Multiple readonly' readonly>
										<mo-option>Manuelle</mo-option>
										<mo-option>Vorschläge</mo-option>
										<mo-option>Automatisch</mo-option>
										<mo-option>Option</mo-option>
										<mo-option>Option</mo-option>
									</mo-field-select>

									<mo-field-pair style='--mo-field-pair-attachment-width: 75px;'>
										<mo-field-select label='mo-field-pair' title='Titel'>
											<mo-option>%</mo-option>
											<mo-option>€</mo-option>
										</mo-field-select>
									</mo-field-pair>
								</mo-grid>
							</mo-section>
						</mo-card>
					</mo-flex>
				</mo-grid>
			</mo-page>
		`
	}
}