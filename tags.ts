import {
	Button,
	Checkbox,
	CheckboxGroup,
	CircularProgress,
	Confetti,
	Dialog,
	Div,
	Drawer,
	DrawerItem,
	DrawerList,
	Fab,
	Flex,
	Grid,
	Icon,
	IconButton,
	IconButtonToggle,
	LinearProgress,
	List,
	ListItem,
	ListItemCheckbox,
	ListItemRadio,
	Menu,
	Option,
	Page,
	Radio,
	Scroll,
	Select,
	Slider,
	Splitter,
	SplitterItem,
	Swiper,
	SwiperSlide,
	Switch,
	Tab,
	TabBar,
	TextArea,
	TextField,
	TopAppBar
} from './components'
import { ContextMenu, ContextMenuItem, DialogDefault, Snackbar } from './library'

declare global {
	interface HTMLElementTagNameMap {
		'mdc-logo': HTMLImageElement
		'mdc-context-menu': ContextMenu
		'mdc-context-menu-item': ContextMenuItem
		'mdc-dialog-default': DialogDefault
		'mdc-snackbar': Snackbar
	}
	interface HTMLElementTagNameMap {
		'mdc-button': Button
		'mdc-checkbox': Checkbox
		'mdc-circular-progress': CircularProgress
		'mdc-dialog': Dialog
		'mdc-drawer': Drawer
		'mdc-fab': Fab
		'mdc-icon': Icon
		'mdc-icon-button': IconButton
		'mdc-icon-button-toggle': IconButtonToggle
		'mdc-linear-progress': LinearProgress
		'mdc-list': List
		'mdc-list-item': ListItem
		'mdc-list-item-checkbox': ListItemCheckbox
		'mdc-list-item-radio': ListItemRadio
		'mdc-menu': Menu
		'mdc-option': Option
		'mdc-radio': Radio
		'mdc-select': Select
		'mdc-slider': Slider
		'mdc-switch': Switch
		'mdc-tab': Tab
		'mdc-tab-bar': TabBar
		'mdc-text-area': TextArea
		'mdc-text-field': TextField
		'mdc-top-app-bar': TopAppBar
	}
	interface HTMLElementTagNameMap {
		'mdc-checkbox-group': CheckboxGroup
		'mdc-confetti': Confetti
		'mdc-div': Div
		'mdc-drawer-item': DrawerItem
		'mdc-drawer-list': DrawerList
		'mdc-flex': Flex
		'mdc-grid': Grid
		'mdc-page': Page
		'mdc-scroll': Scroll
		'mdc-splitter': Splitter
		'mdc-splitter-item': SplitterItem
		'mdc-swiper': Swiper
		'mdc-swiper-slide': SwiperSlide
	}
}