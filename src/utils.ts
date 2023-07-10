import { RequestResult } from 'faunadb';

export function getFaunaError(error: unknown) {
	if (error && typeof error === 'object' && 'requestResult' in error) {
		if (error.requestResult instanceof RequestResult) {
			const responseContent = error.requestResult.responseContent;
			const { code, description } = responseContent.errors[0];
			let status;

			switch (code) {
				case 'unauthorized':
				case 'authentication failed':
					status = 401;
					break;
				case 'permission denied':
					status = 403;
					break;
				case 'instance not found':
					status = 404;
					break;
				case 'instance not unique':
				case 'contended transaction':
					status = 409;
					break;
				default:
					status = 500;
			}

			return { code, description, status };
		}
	}
}
