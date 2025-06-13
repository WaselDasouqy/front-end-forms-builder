// Client-side analytics tracker for form insights
export interface FormAnalytics {
  formId: string;
  views: number;
  completions: number;
  lastViewed: Date;
  viewHistory: Date[];
  completionHistory: Date[];
}

const ANALYTICS_KEY = 'formwave_analytics';

/**
 * Get analytics data from localStorage
 */
export const getAnalytics = (): Record<string, FormAnalytics> => {
  if (typeof window === 'undefined') return {};
  
  try {
    const data = localStorage.getItem(ANALYTICS_KEY);
    if (!data) return {};
    
    const parsed = JSON.parse(data);
    // Convert date strings back to Date objects
    Object.keys(parsed).forEach(formId => {
      parsed[formId].lastViewed = new Date(parsed[formId].lastViewed);
      parsed[formId].viewHistory = parsed[formId].viewHistory.map((d: string) => new Date(d));
      parsed[formId].completionHistory = parsed[formId].completionHistory.map((d: string) => new Date(d));
    });
    
    return parsed;
  } catch (error) {
    console.error('Error reading analytics:', error);
    return {};
  }
};

/**
 * Save analytics data to localStorage
 */
const saveAnalytics = (analytics: Record<string, FormAnalytics>) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
  } catch (error) {
    console.error('Error saving analytics:', error);
  }
};

/**
 * Track a form view
 */
export const trackFormView = (formId: string) => {
  const analytics = getAnalytics();
  const now = new Date();
  
  if (!analytics[formId]) {
    analytics[formId] = {
      formId,
      views: 0,
      completions: 0,
      lastViewed: now,
      viewHistory: [],
      completionHistory: []
    };
  }
  
  analytics[formId].views += 1;
  analytics[formId].lastViewed = now;
  analytics[formId].viewHistory.push(now);
  
  // Keep only last 30 days of history to prevent excessive storage
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  analytics[formId].viewHistory = analytics[formId].viewHistory.filter(date => date >= thirtyDaysAgo);
  
  saveAnalytics(analytics);
};

/**
 * Track a form completion
 */
export const trackFormCompletion = (formId: string) => {
  const analytics = getAnalytics();
  const now = new Date();
  
  if (!analytics[formId]) {
    analytics[formId] = {
      formId,
      views: 0,
      completions: 0,
      lastViewed: now,
      viewHistory: [],
      completionHistory: []
    };
  }
  
  analytics[formId].completions += 1;
  analytics[formId].completionHistory.push(now);
  
  // Keep only last 30 days of history
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  analytics[formId].completionHistory = analytics[formId].completionHistory.filter(date => date >= thirtyDaysAgo);
  
  saveAnalytics(analytics);
};

/**
 * Get completion rate for a form
 */
export const getCompletionRate = (formId: string): number => {
  const analytics = getAnalytics();
  const formAnalytics = analytics[formId];
  
  if (!formAnalytics || formAnalytics.views === 0) return 0;
  
  return (formAnalytics.completions / formAnalytics.views) * 100;
};

/**
 * Get most active time/day for a form
 */
export const getMostActiveTime = (formId: string): string => {
  const analytics = getAnalytics();
  const formAnalytics = analytics[formId];
  
  if (!formAnalytics || formAnalytics.viewHistory.length === 0) {
    return 'No data';
  }
  
  // Count views by hour of day
  const hourCounts: Record<number, number> = {};
  formAnalytics.viewHistory.forEach(date => {
    const hour = date.getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  
  // Find the hour with most views
  const mostActiveHour = Object.keys(hourCounts).reduce((a, b) => 
    hourCounts[parseInt(a)] > hourCounts[parseInt(b)] ? a : b
  );
  
  return `${mostActiveHour}:00 - ${parseInt(mostActiveHour) + 1}:00`;
}; 