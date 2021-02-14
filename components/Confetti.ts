import { component, html, Component, element, internalProperty } from '../library'

class ConfettiParticle {
	constructor(
		private context: CanvasRenderingContext2D,
		public width: number,
		public height: number,
		private lightness = 50,
		private diameter = Math.random() * 6 + 4,
		private tilt = 0,
		private tiltAngleIncrement = Math.random() * 0.1 + 0.04,
		private tiltAngle = 0,
		private particleSpeed = window.innerHeight * 0.01,
		private waveAngle = 0,
		private x = 0,
		private y = 0,
		private color = Math.floor(Math.random() * 360)
	) {
		this.reset()
	}

	reset() {
		this.x = Math.random() * this.width
		this.y = Math.random() * this.height - this.height
	}

	update() {
		this.waveAngle += this.tiltAngleIncrement
		this.tiltAngle += this.tiltAngleIncrement
		this.tilt = Math.sin(this.tiltAngle) * 12
		this.x += Math.sin(this.waveAngle)
		this.y += (Math.cos(this.waveAngle) + this.diameter + this.particleSpeed) * 0.4
	}

	draw() {
		const x = this.x + this.tilt
		this.context.beginPath()
		this.context.lineWidth = this.diameter
		this.context.strokeStyle = `hsl(${this.color}, 50%, ${this.lightness}%)`
		this.context.moveTo(x + this.diameter / 2, this.y)
		this.context.lineTo(x, this.y + this.tilt + this.diameter / 2)
		this.context.stroke()
	}

	get isFinished() {
		return (this.y > this.height + 20)
	}
}

@component('mo-confetti')
export class Confetti extends Component {
	static get instance() { return MoDeL.application.shadowRoot.querySelector('mo-confetti') as Confetti }

	static get rain() { return this.instance.rain.bind(this.instance) }

	async rain() {
		const animate = () => {
			requestAnimationFrame(animate)
			this.canvParticleContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

			for (const particle of particles) {
				particle.width = this.canvasWidth
				particle.height = this.canvasHeight
				particle.update()
				particle.draw()
			}
		}

		this.display = ''
		this.canvasWidth = window.innerWidth
		this.canvasHeight = window.innerHeight

		const particles = Array<ConfettiParticle>()
		const totalParticleCount = Math.round(this.canvasWidth / 2.5)
		for (let i = 0; i < totalParticleCount; ++i) {
			particles.push(new ConfettiParticle(this.canvParticleContext, this.canvasWidth, this.canvasHeight))
		}

		animate()

		while (particles.every(p => p.isFinished) === false) {
			await PromiseTask.sleep(500)
		}

		this.display = 'none'
	}

	@internalProperty() private canvasWidth = 0
	@internalProperty() private canvasHeight = 0

	@element private readonly canvParticle!: HTMLCanvasElement
	private get canvParticleContext() { return this.canvParticle.getContext('2d') as CanvasRenderingContext2D }

	protected initialized() {
		this.display = 'none'
	}

	protected render = () => html`
		<style>
			:host {
				z-index: 11;
				top: 0;
				width: 100%;
				height: 100%;
				position: absolute;
			}

			#canvParticle {
				width: 100%;
				height: 100%;
				position: absolute;
			}
		</style>
		<canvas id='canvParticle' width=${this.canvasWidth} height=${this.canvasHeight}></canvas>
	`
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-confetti': Confetti
	}
}