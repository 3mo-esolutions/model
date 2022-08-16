import { component, html } from '../../library'
import { PageComponent } from './PageComponent'
import { HttpErrorCode, Localizer } from '../..'

Localizer.register(LanguageCode.German, {
	'Bad Request': 'Schlechte Anfrage',
	'Unauthorized': 'Nicht autorisiert',
	'Payment Required': 'Zahlung erforderlich',
	'Page Not Found': 'Seite nicht gefunden',
	'Access Denied': 'Zugriff verweigert',
	'Method Not Allowed': 'Methode nicht erlaubt',
	'Not Accepted': 'Nicht akzeptiert',
	'Proxy Authentication Required': 'Proxy-Authentifizierung erforderlich',
	'Request Timeout': 'Zeitüberschreitung der Anfrage',
	'Conflict': 'Konflikt',
	'Gone': 'Weg',
	'Length Required': 'Länge erforderlich',
	'Precondition Failed': 'Voraussetzung fehlgeschlagen',
	'Request Entity Too Large': 'Anfrage zu groß',
	'Request Uri Too Long': 'Uri zu lang anfordern',
	'Unsupported Media Type': 'Nicht unterstützter Medientyp',
	'Requested Range Not Satisfiable': 'Angeforderter Bereich nicht erfüllbar',
	'Expectation Failed': 'Erwartung fehlgeschlagen',
	'Misdirected Request': 'Fehlgeleitete Anfrage',
	'Unprocessable Entity': 'Nicht verarbeitbare Entität',
	'Locked': 'Gesperrt',
	'Failed Dependency': 'Fehlgeschlagene Abhängigkeit',
	'Upgrade Required': 'Upgrade erforderlich',
	'Precondition Required': 'Voraussetzung erforderlich',
	'Too Many Requests': 'Zu viele Anfragen',
	'Request Header Fields Too Large': 'Header-Felder anfordern zu groß',
	'Unavailable For Legal Reasons': 'Aus rechtlichen Gründen nicht verfügbar',
	'Internal Server Error': 'Interner Serverfehler',
	'Not Implemented': 'Nicht implementiert',
	'Bad Gateway': 'Bad Gateway',
	'Service Unavailable': 'Dienst nicht verfügbar',
	'Gateway Timeout': 'Gateway-Zeitüberschreitung',
	'Http Version Not Supported': 'Http-Version nicht unterstützt',
	'Variant Also Negotiates': 'Variante verhandelt auch',
	'Insufficient Storage': 'Unzureichender Speicherplatz',
	'Loop Detected': 'Schleife erkannt',
	'Not Extended': 'Nicht verlängert',
	'Network Authentication Required': 'Netzwerkauthentifizierung erforderlich',
})

@component('mo-page-error')
export class PageError extends PageComponent<{ readonly error: HttpErrorCode, readonly message?: string }> {
	private static readonly errors = new Map<HttpErrorCode, { readonly emoji?: string, readonly defaultMessage: string }>([
		[HttpErrorCode.BadRequest, { emoji: '😟', defaultMessage: _('Bad Request') }],
		[HttpErrorCode.Unauthorized, { emoji: '⛔', defaultMessage: _('Unauthorized') }],
		[HttpErrorCode.PaymentRequired, { emoji: '🤑', defaultMessage: _('Payment Required') }],
		[HttpErrorCode.NotFound, { emoji: '🧐', defaultMessage: _('Page Not Found') }],
		[HttpErrorCode.Forbidden, { emoji: '🔒', defaultMessage: _('Access Denied') }],
		[HttpErrorCode.MethodNotAllowed, { emoji: '🚫', defaultMessage: _('Method Not Allowed') }],
		[HttpErrorCode.NotAcceptable, { emoji: '😵', defaultMessage: _('Not Accepted') }],
		[HttpErrorCode.ProxyAuthenticationRequired, { emoji: '🤐', defaultMessage: _('Proxy Authentication Required') }],
		[HttpErrorCode.RequestTimeout, { emoji: '⏲', defaultMessage: _('Request Timeout') }],
		[HttpErrorCode.Conflict, { emoji: '😵', defaultMessage: _('Conflict') }],
		[HttpErrorCode.Gone, { defaultMessage: _('Gone') }],
		[HttpErrorCode.LengthRequired, { defaultMessage: _('Length Required') }],
		[HttpErrorCode.PreconditionFailed, { defaultMessage: _('Precondition Failed') }],
		[HttpErrorCode.RequestEntityTooLarge, { defaultMessage: _('Request Entity Too Large') }],
		[HttpErrorCode.RequestUriTooLong, { defaultMessage: _('Request Uri Too Long') }],
		[HttpErrorCode.UnsupportedMediaType, { defaultMessage: _('Unsupported Media Type') }],
		[HttpErrorCode.RequestedRangeNotSatisfiable, { defaultMessage: _('Requested Range Not Satisfiable') }],
		[HttpErrorCode.ExpectationFailed, { defaultMessage: _('Expectation Failed') }],
		[HttpErrorCode.MisdirectedRequest, { defaultMessage: _('Misdirected Request') }],
		[HttpErrorCode.UnprocessableEntity, { defaultMessage: _('Unprocessable Entity') }],
		[HttpErrorCode.Locked, { defaultMessage: _('Locked') }],
		[HttpErrorCode.FailedDependency, { defaultMessage: _('Failed Dependency') }],
		[HttpErrorCode.UpgradeRequired, { defaultMessage: _('Upgrade Required') }],
		[HttpErrorCode.PreconditionRequired, { defaultMessage: _('Precondition Required') }],
		[HttpErrorCode.TooManyRequests, { defaultMessage: _('Too Many Requests') }],
		[HttpErrorCode.RequestHeaderFieldsTooLarge, { defaultMessage: _('Request Header Fields Too Large') }],
		[HttpErrorCode.UnavailableForLegalReasons, { defaultMessage: _('Unavailable For Legal Reasons') }],
		[HttpErrorCode.InternalServerError, { emoji: '😥', defaultMessage: _('Internal Server Error') }],
		[HttpErrorCode.NotImplemented, { emoji: '😳', defaultMessage: _('Not Implemented') }],
		[HttpErrorCode.BadGateway, { emoji: '🥴', defaultMessage: _('Bad Gateway') }],
		[HttpErrorCode.ServiceUnavailable, { emoji: '😴', defaultMessage: _('Service Unavailable') }],
		[HttpErrorCode.GatewayTimeout, { emoji: '⌚', defaultMessage: _('Gateway Timeout') }],
		[HttpErrorCode.HttpVersionNotSupported, { emoji: '🙄', defaultMessage: _('Http Version Not Supported') }],
		[HttpErrorCode.VariantAlsoNegotiates, { emoji: '🤪', defaultMessage: _('Variant Also Negotiates') }],
		[HttpErrorCode.InsufficientStorage, { emoji: '💾', defaultMessage: _('Insufficient Storage') }],
		[HttpErrorCode.LoopDetected, { emoji: '➰', defaultMessage: _('Loop Detected') }],
		[HttpErrorCode.NotExtended, { defaultMessage: _('Not Extended') }],
		[HttpErrorCode.NetworkAuthenticationRequired, { defaultMessage: _('Network Authentication Required') }],
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

			<mo-page heading=${`Error ${this.parameters.error}`} fullHeight>
				<mo-flex gap='var(--mo-thickness-xl)' alignItems='center' justifyContent='center'>
					<mo-div class='code'>${this.errorTemplate}</mo-div>
					<mo-flex gap='var(--mo-thickness-m)'>
						<mo-heading typography='heading1' textAlign='center'>${this.parameters.message ?? PageError.errors.get(this.parameters.error)?.defaultMessage}</mo-heading>
						<mo-heading typography='heading3' textAlign='center'>Open the menu and navigate to a page</mo-heading>
					</mo-flex>
				</mo-flex>
			</mo-page>
		`
	}

	private get errorTemplate() {
		const error = PageError.errors.get(this.parameters.error)
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