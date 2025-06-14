export interface FormAnalytics { id: string; views: number; completions: number; } export function getAnalytics(): Record<string, FormAnalytics> { return {}; }
