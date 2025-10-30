'use client';
import { useSupabaseAuth } from '@/components/SupabaseAuthProvider';
import { useEffect, useState } from 'react';
import { getUserRatingStats, getUserRatings, createRating } from '@/lib/rating-service';
import { RatingSummary, ReviewCard, RatingComponent } from '@/components/ui/rating-components';
import type { RatingStats, UserRating } from '@/lib/rating-service';

interface User {
  id: string;
  name: string;
  email: string;
  skills: { name: string; level: string }[];
  courses: { code: string; grade: string }[];
}

export default function RatingTestPage() {
  const { user: authUser } = useSupabaseAuth();
  const [user, setUser] = useState<User | null>(null);
  const [ratingStats, setRatingStats] = useState<RatingStats | null>(null);
  const [reviews, setReviews] = useState<UserRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [testRating, setTestRating] = useState(0);
  const [testReview, setTestReview] = useState('');

  // Mock user for testing (replace with actual user data)
  useEffect(() => {
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: authUser?.email || 'john@example.com',
      skills: [
        { name: 'React', level: 'ADVANCED' },
        { name: 'TypeScript', level: 'INTERMEDIATE' },
        { name: 'Node.js', level: 'ADVANCED' }
      ],
      courses: [
        { code: 'CS101', grade: 'A' },
        { code: 'CS201', grade: 'B+' },
        { code: 'CS301', grade: 'A-' }
      ]
    };
    setUser(mockUser);
  }, [authUser]);

  // Load rating data
  useEffect(() => {
    if (!user) return;

    const loadRatingData = async () => {
      try {
        setLoading(true);
        const [stats, userReviews] = await Promise.all([
          getUserRatingStats(user.id),
          getUserRatings(user.id)
        ]);
        setRatingStats(stats);
        setReviews(userReviews);
      } catch (error) {
        console.error('Error loading rating data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRatingData();
  }, [user]);

  const handleTestRating = async () => {
    if (!user || !authUser?.email || testRating === 0) return;

    try {
      const result = await createRating({
        raterId: '2', // Mock rater ID
        ratedId: user.id,
        rating: testRating,
        review: testReview || undefined,
        category: 'skill',
        skillOrCourse: 'React'
      });

      if (result.ok) {
        // Reload rating data
        const [stats, userReviews] = await Promise.all([
          getUserRatingStats(user.id),
          getUserRatings(user.id)
        ]);
        setRatingStats(stats);
        setReviews(userReviews);
        setTestRating(0);
        setTestReview('');
        alert('Rating submitted successfully!');
      } else {
        alert('Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Error submitting rating');
    }
  };

  if (!user) {
    return <div className="p-6">Loading user data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill) => (
                <span
                  key={skill.name}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill.name} ({skill.level})
                </span>
              ))}
            </div>
          </div>

          {/* Courses */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Courses</h3>
            <div className="flex flex-wrap gap-2">
              {user.courses.map((course) => (
                <span
                  key={course.code}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {course.code} (Grade: {course.grade})
                </span>
              ))}
            </div>
          </div>

          {/* Rating Summary */}
          {loading ? (
            <div className="text-center py-4">Loading ratings...</div>
          ) : ratingStats ? (
            <RatingSummary
              averageRating={ratingStats.averageRating}
              totalRatings={ratingStats.totalRatings}
              ratingDistribution={ratingStats.ratingDistribution}
            />
          ) : null}
        </div>

        {/* Test Rating Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Test Rating System</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rate this user:
              </label>
              <RatingComponent
                currentRating={testRating}
                onRate={setTestRating}
                size="lg"
                readOnly={false}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review (optional):
              </label>
              <textarea
                value={testReview}
                onChange={(e) => setTestReview(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Share your experience..."
              />
            </div>
            <button
              onClick={handleTestRating}
              disabled={testRating === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Submit Rating
            </button>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Reviews ({reviews.length})</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reviews yet</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}