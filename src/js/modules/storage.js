import errorHandler from './error-handler';

export function load(key) {
	if (window.localStorage) {
		try {
			const data = localStorage.loadItem(key);
			return data;
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