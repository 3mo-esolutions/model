import { component, html } from '../../library'
import { PageComponent } from '.'
import { HttpErrorCode } from '../..'

@component('mo-page-error')
export class PageError extends PageComponent<{ readonly error: HttpErrorCode, readonly message?: string }> {
	// TODO: Localize
	private readonly errors = new Map<HttpErrorCode, { readonly emoji?: string, readonly defaultMessage: string }>([
		[HttpErrorCode.BadRequest, { emoji: '😟', defaultMessage: 'Bad Request' }],
		[HttpErrorCode.Unauthorized, { emoji: '⛔', defaultMessage: 'Unauthorized' }],
		[HttpErrorCode.PaymentRequired, { emoji: '🤑', defaultMessage: 'Payment Required' }],
		[HttpErrorCode.NotFound, { emoji: '🧐', defaultMessage: 'Page Not Found' }],
		[HttpErrorCode.Forbidden, { emoji: '🔒', defaultMessage: 'Access Denied' }],
		[HttpErrorCode.MethodNotAllowed, { emoji: '🚫', defaultMessage: 'Method Not Allowed' }],
		[HttpErrorCode.NotAcceptable, { emoji: '😵', defaultMessage: 'Not Accepted' }],
		[HttpErrorCode.ProxyAuthenticationRequired, { emoji: '🤐', defaultMessage: 'Proxy Authentication Required' }],
		[HttpErrorCode.RequestTimeout, { emoji: '⏲', defaultMessage: 'Request Timeout' }],
		[HttpErrorCode.Conflict, { emoji: '😵', defaultMessage: 'Conflict' }],
		[HttpErrorCode.Gone, { defaultMessage: 'Gone' }],
		[HttpErrorCode.LengthRequired, { defaultMessage: 'Length Required' }],
		[HttpErrorCode.PreconditionFailed, { defaultMessage: 'Precondition Failed' }],
		[HttpErrorCode.RequestEntityTooLarge, { defaultMessage: 'Request Entity Too Large' }],
		[HttpErrorCode.RequestUriTooLong, { defaultMessage: 'Request Uri Too Long' }],
		[HttpErrorCode.UnsupportedMediaType, { defaultMessage: 'Unsupported Media Type' }],
		[HttpErrorCode.RequestedRangeNotSatisfiable, { defaultMessage: 'Requested Range Not Satisfiable' }],
		[HttpErrorCode.ExpectationFailed, { defaultMessage: 'Expectation Failed' }],
		[HttpErrorCode.MisdirectedRequest, { defaultMessage: 'Misdirected Request' }],
		[HttpErrorCode.UnprocessableEntity, { defaultMessage: 'Unprocessable Entity' }],
		[HttpErrorCode.Locked, { defaultMessage: 'Locked' }],
		[HttpErrorCode.FailedDependency, { defaultMessage: 'Failed Dependency' }],
		[HttpErrorCode.UpgradeRequired, { defaultMessage: 'Upgrade Required' }],
		[HttpErrorCode.PreconditionRequired, { defaultMessage: 'Precondition Required' }],
		[HttpErrorCode.TooManyRequests, { defaultMessage: 'Too Many Requests' }],
		[HttpErrorCode.RequestHeaderFieldsTooLarge, { defaultMessage: 'Request Header Fields TooLarge' }],
		[HttpErrorCode.UnavailableForLegalReasons, { defaultMessage: 'Unavailable For Legal Reasons' }],
		[HttpErrorCode.InternalServerError, { emoji: '😥', defaultMessage: 'Internal Server Error' }],
		[HttpErrorCode.NotImplemented, { emoji: '😳', defaultMessage: 'Not Implemented' }],
		[HttpErrorCode.BadGateway, { emoji: '🥴', defaultMessage: 'Bad Gateway' }],
		[HttpErrorCode.ServiceUnavailable, { emoji: '😴', defaultMessage: 'Service Unavailable' }],
		[HttpErrorCode.GatewayTimeout, { emoji: '⌚', defaultMessage: 'Gateway Timeout' }],
		[HttpErrorCode.HttpVersionNotSupported, { emoji: '🙄', defaultMessage: 'Http Version Not Supported' }],
		[HttpErrorCode.VariantAlsoNegotiates, { emoji: '🤪', defaultMessage: 'Variant Also Negotiates' }],
		[HttpErrorCode.InsufficientStorage, { emoji: '💾', defaultMessage: 'Insufficient Storage' }],
		[HttpErrorCode.LoopDetected, { emoji: '➰', defaultMessage: 'Loop Detected' }],
		[HttpErrorCode.NotExtended, { defaultMessage: 'Not Extended' }],
		[HttpErrorCode.NetworkAuthenticationRequired, { defaultMessage: 'Network Authentication Required' }],
	])

	protected override get template() {
		return html`
			<style>
				.code {
					font-size: 60px;
					text-align: center;
					font-weight: 400;
				}

				.code span {
					color: var(--mo-accent);
				}
			</style>

			<mo-page header=${`Error ${this.parameters.error}`} fullHeight>
				<mo-flex height='100%' width='100%' gap='var(--mo-thickness-xl)' alignItems='center' justifyContent='center'>
					<mo-div class='code'>${this.errorTemplate}</mo-div>
					<mo-flex gap='var(--mo-thickness-m)'>
						<mo-headline typography='headline1' textAlign='center'>${this.parameters.message ?? this.errors.get(this.parameters.error)?.defaultMessage}</mo-headline>
						<mo-headline typography='headline3' textAlign='center'>Open the menu and navigate to a page</mo-headline>
					</mo-flex>
				</mo-flex>
			</mo-page>
		`
	}

	private get errorTemplate() {
		const error = this.errors.get(this.parameters.error)
		const errorCode = String(this.parameters.error)
		return !error?.emoji ? html`
			<span>${errorCode}</span>
		` : html`
			<span>${errorCode.charAt(0)}</span>${error.emoji}<span>${errorCode.charAt(2)}</span>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-page-error': PageError
	}
}