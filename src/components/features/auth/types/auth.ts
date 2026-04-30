export interface PasswordProtectionProps {
	postId?: number;
	hint?: string;
}

export interface VerifyPostPasswordRequest {
	password: string;
}

export interface PasswordModalProps {
	hint?: string;
	postId?: number;
}

export interface ValidationMessages {
	unlocking: string;
	incorrect: string;
	decryptError: string;
	unlock: string;
	passwordRequired: string;
	decryptionError: string;
	retry: string;
}

export interface UnlockCallbacks {
	onUnlockStart?: () => void;
	onUnlockSuccess?: (content: string) => void;
	onUnlockError?: (error: string) => void;
}

export interface CopyCodeOptions {
	code: string;
	timeoutId?: number;
}
