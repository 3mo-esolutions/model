function nameof<T>(key: keyof T) {
	return key
}

window.nameof = nameof