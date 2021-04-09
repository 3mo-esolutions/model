import { Octokit } from '@octokit/core'

export class GitHubHelper {
	private static readonly client = new Octokit

	static async fetch(file: string) {
		const response = await this.client.request('GET /repos/:owner/:repo/contents/:path', {
			owner: '3mo-esolutions',
			repo: 'model',
			path: file,
		})

		return decodeURIComponent(escape(atob(response.data.content)))
	}
}