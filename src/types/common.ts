/**
 * Common type for IDs across the application.
 * Currently supports both string and number as the backend might return either
 * (especially when dealing with both real API and mock data).
 */
export type EntityId = string | number;
