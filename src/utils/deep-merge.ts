export function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function mergeWithDefault<T>(defaultValue: T, remoteValue: unknown): T {
	if (remoteValue === undefined || remoteValue === null) {
		return defaultValue;
	}

	if (Array.isArray(defaultValue)) {
		if (!Array.isArray(remoteValue)) {
			return defaultValue;
		}
		return remoteValue as T;
	}

	if (isPlainObject(defaultValue)) {
		if (!isPlainObject(remoteValue)) {
			return defaultValue;
		}

		const merged: Record<string, unknown> = { ...defaultValue };
		for (const [key, value] of Object.entries(defaultValue)) {
			merged[key] = mergeWithDefault(value, remoteValue[key]);
		}

		for (const [key, value] of Object.entries(remoteValue)) {
			if (!(key in merged)) {
				merged[key] = value;
			}
		}

		return merged as T;
	}

	return remoteValue as T;
}
