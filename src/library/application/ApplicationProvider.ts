export abstract class ApplicationProvider {
	afterAuthentication = false
	abstract provide(): Promise<void>
}