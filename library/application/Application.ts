import { TemplateResult } from '..'

export default abstract class Application {
	abstract title: string
	abstract get drawerContent(): TemplateResult
}