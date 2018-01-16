import errorHandler from './error-handler';

export function load(key) {
	if (window.localStorage) {
		/*
			Storage.getItem(key) doesn't throw an exception,
			if key is not found it returns null
		*/
		const data = localStorage.getItem(key);
		return data === null ? false : data; // getItem returns null if key isn't found
	}
	else {
		errorHandler('localStorage not supported');
		return false;
	}
}

export function save(key, data) {
	if (window.localStorage) {
		try {
			localStorage.setItem(key, data);
			return true;
		}
		catch (e) {
			errorHandler(e);
			return false;
		}
	}
	else {
		errorHandler('localStorage not supported');
		return false;
	}
}