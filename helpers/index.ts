import JsonHelper from './JsonHelper'
import ClientInfoHelper from './ClientInfoHelper'
import PwaHelper from './PwaHelper'
import PermissionHelper from './PermissionHelper'
import debounce from './debounce'
import PromiseTask from './PromiseTask'
import LocalStorageEntry from './LocalStorage'
import localStorageEntryBuilder from './localStorageEntryBuilder'
import StorageContainer from './StorageContainer'
import FeatureFlagHelper from './FeatureFlagHelper'
import LocalizationHelper from './LocalizationHelper'

export {
	JsonHelper,
	ClientInfoHelper,
	PwaHelper,
	PermissionHelper,
	debounce,
	PromiseTask,
	LocalStorageEntry,
	localStorageEntryBuilder,
	StorageContainer,
	FeatureFlagHelper,
	LocalizationHelper,
}

globalThis.$ = LocalizationHelper.localize.bind(LocalizationHelper)