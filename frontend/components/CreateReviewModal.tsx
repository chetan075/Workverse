'use client';

import { useState } from 'react';
import { Star, X, CheckCircle, AlertCircle, User } from 'lucide-react';
import { createReview } from '@/lib/api';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    title: string;
    client?: { id: string; name: string };
    freelancer?: { id: string; name: string };
  };
  userRole: 'client' | 'freelancer';
}

interface ReviewForm {
  rating: number;
  comment: string;
  quality: number;
  communication: number;
  timeliness: number;
  professionalism: number;
}

const initialForm: ReviewForm = {
  rating: 0,
  comment: '',
  quality: 0,
  communication: 0,
  timeliness: 0,
  professionalism: 0
};

const ratingLabels = [
  { key: 'quality', label: 'Quality of Work', description: 'How satisfied are you with the quality of deliverables?' },
  { key: 'communication', label: 'Communication', description: 'How responsive and clear was the communication?' },
  { key: 'timeliness', label: 'Timeliness', description: 'Were deadlines and milestones met on time?' },
  { key: 'professionalism', label: 'Professionalism', description: 'How professional was the overall conduct?' }
];

const StarRating = ({ 
  rating, 
  onRatingChange, 
  size = 'normal',
  readonly = false 
}: {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: 'small' | 'normal' | 'large';
  readonly?: boolean;
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    normal: 'h-5 w-5',
    large: 'h-6 w-6'
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onRatingChange?.(star)}
          className={`${sizeClasses[size]} ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          } transition-transform`}
          title={`Rate ${star} star${star !== 1 ? 's' : ''}`}
        >
          <Star
            className={`w-full h-full ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export function CreateReviewModal({ isOpen, onClose, project, userRole }: ReviewModalProps) {
  const [form, setForm] = useState<ReviewForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const targetUser = userRole === 'client' ? project.freelancer : project.client;
  
  if (!targetUser) return null;

  const updateForm = (field: keyof ReviewForm, value: number | string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateForm = () => {
    if (form.rating === 0) {
      setError('Please provide an overall rating');
      return false;
    }
    if (form.quality === 0 || form.communication === 0 || form.timeliness === 0 || form.professionalism === 0) {
      setError('Please rate all categories');
      return false;
    }
    if (form.comment.trim().length < 20) {
      setError('Please provide a detailed comment (at least 20 characters)');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      
      await createReview({
        projectId: project.id,
        targetId: targetUser.id,
        rating: form.rating,
        comment: form.comment,
        quality: form.quality,
        communication: form.communication,
        timeliness: form.timeliness,
        professionalism: form.professionalism
      });
      
      setSuccess(true);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setForm(initialForm);
      }, 2000);
      
    } catch (err) {
      console.error('Error creating review:', err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setForm(initialForm);
      setError('');
      setSuccess(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <div className="mb-4">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Review Submitted!</h3>
          <p className="text-gray-600">Thank you for your feedback. It helps build trust in our community.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Leave a Review</h2>
            <p className="text-sm text-gray-600 mt-1">
              Project: {project.title}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            title="Close review modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Target User Info */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{targetUser.name}</p>
              <p className="text-sm text-gray-600">
                {userRole === 'client' ? 'Freelancer' : 'Client'}
              </p>
            </div>
          </div>

          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <StarRating
                rating={form.rating}
                onRatingChange={(rating) => updateForm('rating', rating)}
                size="large"
              />
              <span className="text-sm text-gray-600">
                {form.rating > 0 && (
                  <>
                    {form.rating}/5 - {
                      form.rating === 5 ? 'Excellent' :
                      form.rating === 4 ? 'Good' :
                      form.rating === 3 ? 'Average' :
                      form.rating === 2 ? 'Below Average' : 'Poor'
                    }
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Detailed Ratings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Detailed Ratings <span className="text-red-500">*</span>
            </label>
            <div className="space-y-4">
              {ratingLabels.map((item) => (
                <div key={item.key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.label}</h4>
                      <p className="text-xs text-gray-600">{item.description}</p>
                    </div>
                    <StarRating
                      rating={form[item.key as keyof ReviewForm] as number}
                      onRatingChange={(rating) => updateForm(item.key as keyof ReviewForm, rating)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Written Review */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Written Review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.comment}
              onChange={(e) => updateForm('comment', e.target.value)}
              placeholder="Share your experience working together. What went well? What could be improved?"
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {form.comment.length}/20 characters minimum
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Export StarRating component for use in other components
export { StarRating };