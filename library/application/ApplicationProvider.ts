export default abstract class ApplicationProvider {
	abstract provide(): Promise<void>
	differ = false
}