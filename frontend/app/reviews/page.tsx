'use client';

import { useState, useEffect } from 'react';
import { Star, Filter, Search, User, Calendar, MessageSquare, TrendingUp } from 'lucide-react';
import { StarRating } from '@/components/CreateReviewModal';
import { fetchUserReviews } from '@/lib/api';

interface Review {
  id: string;
  projectId: string;
  authorId: string;
  targetId: string;
  rating: number;
  comment?: string;
  quality?: number;
  communication?: number;
  timeliness?: number;
  professionalism?: number;
  createdAt: string;
  project: { title: string };
  author: { name: string; profileImage?: string | null };
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
}

const filterOptions = [
  { value: 'all', label: 'All Reviews' },
  { value: '5', label: '5 Stars' },
  { value: '4', label: '4 Stars' },
  { value: '3', label: '3 Stars' },
  { value: '2', label: '2 Stars' },
  { value: '1', label: '1 Star' }
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'highest', label: 'Highest Rated' },
  { value: 'lowest', label: 'Lowest Rated' }
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await fetchUserReviews('current-user');
      setReviews(data.reviews);
      setStats(data.stats);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedReviews = reviews
    .filter(review => {
      // Filter by rating
      if (filterRating !== 'all' && review.rating !== parseInt(filterRating)) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          review.comment?.toLowerCase().includes(searchLower) ||
          review.project.title.toLowerCase().includes(searchLower) ||
          review.author.name.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

  const getRatingDistributionPercentage = (rating: number) => {
    if (!stats || stats.totalReviews === 0) return 0;
    return (stats.ratingDistribution[rating] || 0) / stats.totalReviews * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-600 mt-1">All reviews and ratings for your work</p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="h-8 w-8 text-yellow-400 fill-current" />
                  <span className="text-3xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</span>
                </div>
                <p className="text-gray-600">Average Rating</p>
                <p className="text-sm text-gray-500">{stats.totalReviews} reviews</p>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalReviews}</div>
                <p className="text-gray-600">Total Reviews</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Growing</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-gray-600 text-center mb-3">Rating Distribution</p>
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center gap-2 text-sm">
                    <span className="w-6 text-gray-600">{rating}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${getRatingDistributionPercentage(rating)}%`
                        }}
                      ></div>
                    </div>
                    <span className="w-8 text-gray-500 text-xs">
                      {stats.ratingDistribution[rating] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                title="Filter reviews by rating"
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              title="Sort reviews"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredAndSortedReviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-600">
                {searchTerm || filterRating !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Complete some projects to start receiving reviews'
                }
              </p>
            </div>
          ) : (
            filteredAndSortedReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{review.author.name}</p>
                      <p className="text-sm text-gray-600">{review.project.title}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <StarRating rating={review.rating} readonly size="small" />
                      <span className="text-sm font-medium text-gray-900 ml-1">
                        {review.rating}/5
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {review.comment && (
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                )}

                {/* Detailed Ratings */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Quality</p>
                    <div className="flex items-center justify-center gap-1">
                      <StarRating rating={review.quality || 0} readonly size="small" />
                      <span className="text-xs text-gray-600 ml-1">{review.quality}/5</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Communication</p>
                    <div className="flex items-center justify-center gap-1">
                      <StarRating rating={review.communication || 0} readonly size="small" />
                      <span className="text-xs text-gray-600 ml-1">{review.communication}/5</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Timeliness</p>
                    <div className="flex items-center justify-center gap-1">
                      <StarRating rating={review.timeliness || 0} readonly size="small" />
                      <span className="text-xs text-gray-600 ml-1">{review.timeliness}/5</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Professionalism</p>
                    <div className="flex items-center justify-center gap-1">
                      <StarRating rating={review.professionalism || 0} readonly size="small" />
                      <span className="text-xs text-gray-600 ml-1">{review.professionalism}/5</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button - for pagination in real app */}
        {filteredAndSortedReviews.length > 0 && (
          <div className="text-center mt-8">
            <button className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </div>
  );
}