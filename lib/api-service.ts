import 'server-only';
import { auth } from '@/auth';
import { CONFIG } from './config';
import { logger } from './logger';

/**
 * Base API Service
 * Centralized API client with automatic headers, encryption, and error handling
 */

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface FetchOptions extends RequestInit {
    skipEncryption?: boolean;
}

export interface ApiError {
    success: false;
    error: string;
    statusCode?: number;
}

export interface ApiSuccess<T = any> {
    success: true;
    data: T;
    message?: string;
}

export type ApiResponse<T = any> = ApiSuccess<T> | ApiError;

class ApiService {
    private baseUrl: string;
    constructor() {
        this.baseUrl = CONFIG.API_BASE_URL?.endsWith('/')
            ? CONFIG.API_BASE_URL.slice(0, -1)
            : CONFIG.API_BASE_URL;
    }

    /**
     * Main fetch method with automatic headers and encryption
     */
    private async fetchAPI<T>(
        endpoint: string,
        method: HttpMethod,
        body?: BodyInit,
        options: FetchOptions = {}
    ): Promise<T> {
        const session = await auth();

        // Construct Basic Auth Header

        const headers: HeadersInit = {
            'Authorization': `Bearer ${session?.accessToken || ''}`,
            'Content-Type': 'application/json',
            ...options.headers,
        };

        const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const url = `${this.baseUrl}${cleanEndpoint}`;

        logger.apiRequest(method, url, body);

        const response = await fetch(url, {
            method,
            headers,
            body,
            ...options,
        });

        if (!response.ok) {
            const text = await response.text();
            logger.error(`API Error ${response.status} for ${url}:`, text);
            throw new Error(`API Error ${response.status}: ${text}`);
        }
        return response.json();
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
        return this.fetchAPI<T>(endpoint, 'GET', undefined, options);
    }

    /**
     * POST request
     */
    async post<T>(endpoint: string, body: BodyInit, options?: FetchOptions): Promise<T> {
        return this.fetchAPI<T>(endpoint, 'POST', body, options);
    }

    /**
     * PUT request
     */
    async put<T>(endpoint: string, body: BodyInit, options?: FetchOptions): Promise<T> {
        return this.fetchAPI<T>(endpoint, 'PUT', body, options);
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
        return this.fetchAPI<T>(endpoint, 'DELETE', undefined, options);
    }
}

// Export singleton instance
export const apiService = new ApiService();

// Also export as default for backward compatibility
export const api = apiService;
