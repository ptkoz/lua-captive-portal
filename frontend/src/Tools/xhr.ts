interface Dict<T> {
	[key: string]: T;
}

/**
 * Convert object of key => value to urlencoded
 * string.
 */
export function mapParams(data: Dict<any>): string {
	const params: string[] = [];

	for(let key in data) {
		if(!data.hasOwnProperty(key)) continue;

		let value = data[key];
		if(value === null || value === undefined) continue;

		if(Array.isArray(value)) {
			params.push(
				value.map((item: any) => {
					return encodeURIComponent(key) + "[]=" + encodeURIComponent(item);
				}).join("&")
			);
		} else {
			params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
		}
	}

	return params.join('&');
}

/**
 * Some handy functions for performing async requests with
 * promises.
 */
export const xhr = {
	POST: "POST",
	GET: "GET",
	PUT: "PUT",
	READY_STATE_OK: 4,

	/**
	 * Perform query to the server via HTTP
	 */
	query: (method: string, url: string, data: Dict<any> = {}, additionalHeaders: Dict<string> = {}, timeout = 10000): Promise<XMLHttpRequest> => {
		const headers: Dict<string> = { ...additionalHeaders, "Content-Type": "application/x-www-form-urlencoded" };
		return new Promise(
			(resolve, reject) => {
				const request = new XMLHttpRequest();
				const payload = mapParams(data);

				request.open(method, url);

				for(let i in headers) {
					if(!headers.hasOwnProperty(i)) continue;
					request.setRequestHeader(i, headers[i]);
				}

				let timeoutHandler = null;

				request.onload = () => {
					if(timeoutHandler) clearTimeout(timeoutHandler);
					if (request.status >= 200 && request.status < 300) {
						// Performs the function "resolve" when this.status is equal to 2xx
						resolve(request);
					} else {
						// Performs the function "reject" when this.status is different than 2xx
						reject(request);
					}
				};

				request.onerror = () => {
					if(timeoutHandler) clearTimeout(timeoutHandler);
					reject(request);
				};

				if(timeout) {
					timeoutHandler = setTimeout(() => {
						request.abort();
						reject(request);
					}, timeout);
				}

				request.send(payload);
			}
		);
	},

	/**
	 * Perform get request.
	 */
	get: (url: string, data: Dict<string> = {}, headers: Dict<string> = {}): Promise<XMLHttpRequest> => {
		if(data) {
			const params = mapParams(data);

			if(-1 === url.indexOf("?")) url += "?" + params;
			else url += "&" + params;
		}

		return xhr.query(xhr.GET, url, {}, headers);
	},

	/**
	 * Perform get request and parse JSON response
	 */
	getJSON: (url: string, data: Dict<string> = {}, headers: Dict<string> = {}): Promise<any> => {
		return xhr
			.get(url, data, { ...headers, "Accept": "application/json"})
			.then(response => {
				// try to parse response as JSON
				return JSON.parse(response.responseText);
			})
			.catch(error => {
				// error may be XMLHttpRequest or exception thrown by JSON.parse
				if (error instanceof Error) {
					// tslint:disable-next-line no-console
					console.error(error);
					throw new Error("Internal application error");
				}

				let parsedResponse;

				try {
					parsedResponse = JSON.parse(error.responseText);
				} catch(e) {
					// ignore JSON parsing errors
				}

				throw parsedResponse || new Error("Connection error");
			});
	},

	/**
	 * Perform POST request
	 *
	 * @param {string} url
	 * @param {object} data
	 * @param {object} headers
	 */
	post: (url: string, data: Dict<string>, headers: Dict<string> = {}): Promise<XMLHttpRequest> => {
		return xhr.query(xhr.POST, url, data, headers);
	},

	/**
	 * Perform POST request and parse JSON response
	 * @param {string} url
	 * @param {object} data
	 * @param {object} headers
	 */
	postJSON: (url: string, data: Dict<string>, headers: Dict<string> = {}): Promise<any> => {
		return xhr
			.post(url, data, { ...headers, "Accept": "application/json"})
			.then(response => {
				return JSON.parse(response.responseText);
			})
			.catch(error => {
				// error may be XMLHttpRequest or exception thrown by JSON.parse
				if (error instanceof Error) {
					// tslint:disable-next-line no-console
					console.error(error);
					throw new Error("Internal application error");
				}

				let parsedResponse;

				try {
					parsedResponse = JSON.parse(error.responseText);
				} catch(e) {
					// ignore JSON parsing errors
				}

				throw parsedResponse || new Error("Connection error");
			});
	}
};
