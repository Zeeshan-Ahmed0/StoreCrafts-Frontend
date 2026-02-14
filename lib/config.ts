import 'server-only';

/**
 * Centralized configuration module.
 * Reads from process.env and exports strongly typed variables.
 */

export const CONFIG = {
    /**
     * Toggles debug logging.
     * Default: false
     */
    IS_DEBUG: process.env.IS_DEBUG === 'true',

    /**
     * Toggles RNCryptor encryption for API requests.
     * Default: true (unless explicitly set to 'false')
     */
    USE_ENCRYPTION: process.env.USE_ENCRYPTION !== 'false',

    /**
     * Base URL for the API.
     */
    API_BASE_URL: process.env.API_BASE_URL || '',

    /**
     * Basic Auth Credentials
     */
    API_BASIC_AUTH_USER: process.env.API_BASIC_AUTH_USER || '',
    API_BASIC_AUTH_PASS: process.env.API_BASIC_AUTH_PASS || '',
};

/**
 * Helper to convert boolean flags to legacy PHP 1/0 integers.
 * @param val Boolean value
 * @returns 1 if true, 0 if false
 */
export function getLegacyBoolean(val: boolean): number {
    return val ? 1 : 0;
}

// Validate critical config
if (!CONFIG.API_BASE_URL) {
    console.warn('CONFIG WARNING: API_BASE_URL is not set.');
}
