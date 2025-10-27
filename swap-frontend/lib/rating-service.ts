import { API_BASE } from '@/lib/api';

async function safeJson(res: Response) {
  const t = await res.text();
  try {
    return JSON.parse(t);
  } catch {
    return null;
  }
}

export interface CreateRatingData {
  raterId: string;
  ratedId: string;
  sessionId?: string;
  rating: number;
  review?: string;
  category: 'skill' | 'course';
  skillOrCourse: string;
}

export interface RatingStats {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface UserRating {
  id: string;
  rating: number;
  review?: string;
  category: string;
  skillOrCourse: string;
  createdAt: string;
  rater: {
    id: string;
    name: string;
    email: string;
  };
  session?: {
    id: string;
    courseCode: string;
    createdAt: string;
  };
}

// Create a new rating
export async function createRating(data: CreateRatingData) {
  if (!API_BASE) return { ok: false };
  try {
    const response = await fetch(`${API_BASE}/ratings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return { ok: response.ok, data: await safeJson(response) };
  } catch (error) {
    console.error('Error creating rating:', error);
    return { ok: false };
  }
}

// Update an existing rating
export async function updateRating(ratingId: string, raterId: string, data: { rating: number; review?: string }) {
  if (!API_BASE) return { ok: false };
  try {
    const response = await fetch(`${API_BASE}/ratings/${ratingId}?raterId=${raterId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return { ok: response.ok, data: await safeJson(response) };
  } catch (error) {
    console.error('Error updating rating:', error);
    return { ok: false };
  }
}

// Get user's ratings
export async function getUserRatings(userId: string, category?: 'skill' | 'course'): Promise<UserRating[]> {
  if (!API_BASE) return [];
  try {
    const url = category 
      ? `${API_BASE}/ratings/user/${userId}?category=${category}`
      : `${API_BASE}/ratings/user/${userId}`;
    const response = await fetch(url);
    const result = await safeJson(response);
    return result?.data || [];
  } catch (error) {
    console.error('Error fetching user ratings:', error);
    return [];
  }
}

// Get user's rating statistics
export async function getUserRatingStats(userId: string, category?: 'skill' | 'course'): Promise<RatingStats> {
  if (!API_BASE) return { averageRating: 0, totalRatings: 0, ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
  try {
    const url = category 
      ? `${API_BASE}/ratings/user/${userId}/stats?category=${category}`
      : `${API_BASE}/ratings/user/${userId}/stats`;
    const response = await fetch(url);
    const result = await safeJson(response);
    return result?.data || {
      averageRating: 0,
      totalRatings: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  } catch (error) {
    console.error('Error fetching rating stats:', error);
    return {
      averageRating: 0,
      totalRatings: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }
}

// Delete a rating
export async function deleteRating(ratingId: string, raterId: string) {
  if (!API_BASE) return { ok: false };
  try {
    const response = await fetch(`${API_BASE}/ratings/${ratingId}?raterId=${raterId}`, {
      method: 'DELETE'
    });
    return { ok: response.ok, data: await safeJson(response) };
  } catch (error) {
    console.error('Error deleting rating:', error);
    return { ok: false };
  }
}

// Check if user can rate a session
export async function canUserRateSession(sessionId: string, raterId: string): Promise<boolean> {
  if (!API_BASE) return false;
  try {
    const response = await fetch(`${API_BASE}/ratings/session/${sessionId}/can-rate?raterId=${raterId}`);
    const result = await safeJson(response);
    return result?.data?.canRate || false;
  } catch (error) {
    console.error('Error checking if user can rate session:', error);
    return false;
  }
}

// Get top-rated users
export async function getTopRatedUsers(category?: 'skill' | 'course', limit: number = 10) {
  if (!API_BASE) return [];
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    params.append('limit', limit.toString());
    
    const response = await fetch(`${API_BASE}/ratings/top-rated?${params.toString()}`);
    const result = await safeJson(response);
    return result?.data || [];
  } catch (error) {
    console.error('Error fetching top-rated users:', error);
    return [];
  }
}