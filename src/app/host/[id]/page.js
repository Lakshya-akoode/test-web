'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';
import { isAuthenticated, getToken, getUser } from '@/lib/auth';

export default function HostProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { id: hostId } = params;

    const [hostData, setHostData] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' or 'fleet'

    // Review Form State
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchHostProfile();
        fetchHostReviews();
    }, [hostId]);

    const fetchHostProfile = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.HOST_PROFILE}/${hostId}`);
            const data = await response.json();
            if (data.status === 'Success') {
                setHostData(data.data);
            }
        } catch (error) {
            console.error('Error fetching host profile:', error);
        }
    };

    const fetchHostReviews = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.HOST_REVIEWS}/${hostId}`);
            const data = await response.json();
            if (data.status === 'Success') {
                setReviews(data.data.reviews);
                setStats(data.data.stats);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        setSubmitting(true);
        try {
            const token = getToken();
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADD_REVIEW}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    targetId: hostId,
                    rating: newRating,
                    comment: newComment,
                    // photos: [] // TODO: Implement photo upload
                })
            });

            const data = await response.json();
            if (data.status === 'Success') {
                setShowReviewForm(false);
                setNewComment('');
                setNewRating(5);
                fetchHostReviews(); // Refresh reviews
            } else {
                alert(data.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Error submitting review');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!hostData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Host Not Found</h2>
                    <Link href="/home" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const { owner, businessDetails, isRentalBusiness, vehicles } = hostData;
    const hostName = isRentalBusiness ? businessDetails?.businessName : owner?.Name || 'Zugo Host';
    const hostJoinDate = stats?.joinedAt || owner?.createdAt;

    // Calculate average rating if not provided by backend stats yet
    const displayRating = stats?.average || (reviews.length > 0 ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : 'New');
    const displayCount = stats?.total || reviews.length;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero / Cover Section */}
            <div className="h-64 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative">
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Host Info Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-24">
                            <div className="p-8 text-center">
                                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-white font-bold border-4 border-white shadow-lg">
                                    {hostName.charAt(0).toUpperCase()}
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                    {hostName}
                                </h1>
                                {isRentalBusiness && (
                                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-4">
                                        Professional Host
                                    </span>
                                )}
                                <div className="flex items-center justify-center gap-6 mb-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{displayRating}</div>
                                        <div className="text-xs text-gray-500">Rating</div>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200"></div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{displayCount}</div>
                                        <div className="text-xs text-gray-500">Reviews</div>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200"></div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{formatDate(hostJoinDate)}</div>
                                        <div className="text-xs text-gray-500">Joined</div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-md">
                                        Contact Host
                                    </button>
                                    <div className="flex items-center justify-center gap-2 text-sm text-green-600 font-medium">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Identity Verified
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
                                <div className="text-sm text-gray-500 flex justify-between">
                                    <span>Response Rate</span>
                                    <span className="font-bold text-gray-900">100%</span>
                                </div>
                                <div className="text-sm text-gray-500 flex justify-between mt-2">
                                    <span>Response Time</span>
                                    <span className="font-bold text-gray-900">Within an hour</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Content */}
                    <div className="lg:col-span-2 space-y-8 mt-12 lg:mt-0">

                        {/* Tabs */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex gap-2">
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === 'reviews'
                                    ? 'bg-black text-white shadow-lg'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                Reviews ({displayCount})
                            </button>
                            <button
                                onClick={() => setActiveTab('fleet')}
                                className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === 'fleet'
                                    ? 'bg-black text-white shadow-lg'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                My Fleet ({vehicles.length})
                            </button>
                        </div>

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                {/* Rating Summary */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 items-center">
                                    <div className="text-center md:text-left">
                                        <div className="text-5xl font-extrabold text-gray-900 mb-2">{displayRating}</div>
                                        <div className="flex items-center justify-center md:justify-start gap-1 text-yellow-400 mb-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <svg key={star} className={`w-6 h-6 ${star <= Math.round(displayRating) ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-500">Based on {displayCount} reviews</p>
                                    </div>
                                    <div className="space-y-2">
                                        {[5, 4, 3, 2, 1].map((star) => (
                                            <div key={star} className="flex items-center gap-3">
                                                <span className="text-xs font-bold w-3">{star}</span>
                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-yellow-400 rounded-full"
                                                        style={{ width: `${stats && stats.total ? (stats[star] / stats.total) * 100 : 0}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-gray-500 w-8 text-right">{stats ? stats[star] : 0}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Add Review Trigger */}
                                {!showReviewForm && (
                                    <button
                                        onClick={() => setShowReviewForm(true)}
                                        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-bold hover:border-black hover:text-black transition-all mb-8 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Write a Review
                                    </button>
                                )}

                                {/* Review Form */}
                                {showReviewForm && (
                                    <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-bold text-lg">Your Review</h3>
                                            <button type="button" onClick={() => setShowReviewForm(false)} className="text-gray-400 hover:text-gray-600">
                                                ✕
                                            </button>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setNewRating(star)}
                                                        className={`w-8 h-8 ${star <= newRating ? 'text-yellow-400' : 'text-gray-300'} transition-colors`}
                                                    >
                                                        <svg className="w-full h-full fill-current" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Review</label>
                                            <textarea
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                rows="4"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-all font-medium text-gray-900"
                                                placeholder="Share your experience..."
                                                required
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-900 transition-all shadow-lg disabled:opacity-50"
                                        >
                                            {submitting ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                )}

                                {/* Reviews List */}
                                <div className="space-y-6">
                                    {reviews.map((review) => (
                                        <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                                                        {review.reviewerId?.username?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900">{review.reviewerId?.username || 'User'}</div>
                                                        <div className="text-xs text-gray-500">{formatDate(review.createdAt)}</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-lg">
                                                    <span className="font-bold text-yellow-700 text-sm">{review.rating}</span>
                                                    <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed text-sm">
                                                {review.comment}
                                            </p>
                                        </div>
                                    ))}
                                    {reviews.length === 0 && (
                                        <div className="text-center py-12 text-gray-500">
                                            No reviews yet. Be the first to share your experience!
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Fleet Tab */}
                        {activeTab === 'fleet' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {vehicles.map((vehicle) => (
                                    <Link key={vehicle._id} href={`/book/bike?id=${vehicle._id}`} className="group block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-100 transition-all">
                                        <div className="relative h-48 bg-gray-100">
                                            <img
                                                src={vehicle.vehiclePhoto}
                                                alt={vehicle.vehicleModel}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-gray-900 shadow-sm">
                                                {vehicle.fuelType || 'Petrol'}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">{vehicle.vehicleModel}</h3>
                                            <p className="text-xs text-gray-500 mb-3">{vehicle.vehicleType}</p>
                                            <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-lg font-extrabold text-blue-600">₹{vehicle.rentalPrice}</span>
                                                    <span className="text-xs text-gray-500">/day</span>
                                                </div>
                                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded text-center">Available</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                {vehicles.length === 0 && (
                                    <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
                                        No vehicles listed currently.
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
