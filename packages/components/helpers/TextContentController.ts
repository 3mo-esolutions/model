import { ReactiveControllerHost } from '../../library'
import { MutationController } from './MutationController'

export class TextContentController extends MutationController {
	constructor(
		host: ReactiveControllerHost & Node,
		textContentChanged: (textContent: string) => void,
	) {
		super(host, () => textContentChanged(this.textContent), {
			subtree: true,
			characterData: true,
			childList: true,
		})
	}

	private get textContent() {
		return this.host.textContent?.trim() ?? ''
	}
}