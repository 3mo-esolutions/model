
import en from './en.json'


<button>${
	_("Click me")
}</button>

type EngKey = keyof typeof en
type DeKey = keyof typeof de

type Key = en & de

_('{length} product has been saved')
_('{length} product has been saved', 5)
_(length, '${length} Product(s) is/are saved', '"${length} product has been saved"', name, asdasd)