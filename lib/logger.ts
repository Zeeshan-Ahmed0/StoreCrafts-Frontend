import { CONFIG } from './config';

/**
 * Centralized Logger utility.
 * Respects IS_DEBUG flag to suppress logs in production.
 */

class Logger {
    private isDebug: boolean;

    constructor() {
        this.isDebug = CONFIG.IS_DEBUG;
    }

    /**
     * Log informational messages
     */
    log(...args: any[]): void {
        if (this.isDebug) {
            console.log(...args);
        }
    }

    /**
     * Log error messages (always shown, even in production)
     */
    error(...args: any[]): void {
        console.error(...args);
    }

    /**
     * Log warning messages
     */
    warn(...args: any[]): void {
        if (this.isDebug) {
            console.warn(...args);
        }
    }

    /**
     * Trace method for debugging API calls and actions
     * @param action Action name (e.g., 'MIGRATE_FACILITY')
     * @param payload Data being sent/received
     */
    trace(action: string, payload?: any): void {
        if (this.isDebug) {
            console.log(`[Action: ${action}]`, payload ? `- Payload: ${JSON.stringify(payload, null, 2)}` : '');
        }
    }

    /**
     * Log API request details
     */
    apiRequest(method: string, endpoint: string, body?: any): void {
        if (this.isDebug) {
            console.log(`[API Request] ${method} ${endpoint}`, body ? `\nBody: ${JSON.stringify(body, null, 2)}` : '');
        }
    }

    /**
     * Log API response details
     */
    apiResponse(endpoint: string, response: any): void {
        if (this.isDebug) {
            console.log(`[API Response] ${endpoint}\n`, JSON.stringify(response, null, 2));
        }
    }
}

// Export singleton instance
export const logger = new Logger();
