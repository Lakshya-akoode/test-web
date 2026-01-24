'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';
import { isAuthenticated, getToken, getUser } from '@/lib/auth';

export default function HostProfilePage() {
    const params = useParams();
    const router = useRouter();
    const toast = useToast();
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
                toast.success('Review submitted successfully!');
                fetchHostReviews(); // Refresh reviews
            } else {
                toast.error(data.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Error submitting review');
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

    // Calculate average rating
    const displayRating = stats?.average || (reviews.length > 0 ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : 'New');
    const displayCount = stats?.total || reviews.length;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* Hero / Cover Section - Premium Dark Theme */}
            <div className="h-80 bg-black relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Host Info Card */}
                    <div className="lg:col-span-4">
                        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 overflow-hidden sticky top-24">
                            <div className="relative h-32 bg-gradient-to-br from-blue-600 to-indigo-700">
                                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                                    <div className="w-32 h-32 bg-white rounded-full p-2 shadow-xl">
                                        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-full flex items-center justify-center text-5xl text-white font-bold border-4 border-white">
                                            {hostName.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-20 pb-8 px-8 text-center">
                                <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                                    {hostName}
                                </h1>
                                {isRentalBusiness && (
                                    <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        Professional Host
                                    </span>
                                )}

                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="text-center p-3 bg-gray-50 rounded-2xl">
                                        <div className="text-xl font-black text-gray-900">{displayRating}</div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rating</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-2xl">
                                        <div className="text-xl font-black text-gray-900">{displayCount}</div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Reviews</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-2xl">
                                        <div className="text-lg font-black text-gray-900 truncate">{formatDate(hostJoinDate).split(' ')[0]}</div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Joined</div>
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                    Contact Host
                                </button>

                                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-green-700 font-bold bg-green-50/50 py-3 rounded-xl">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                        <svg className="w-3 h-3 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    Identity Verified
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Content */}
                    <div className="lg:col-span-8 space-y-8 mt-4 lg:mt-0">

                        {/* Tabs */}
                        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 p-2 flex gap-2 w-full sm:w-auto inline-flex">
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'reviews'
                                    ? 'bg-black text-white shadow-lg scale-105'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                Reviews ({displayCount})
                            </button>
                            <button
                                onClick={() => setActiveTab('fleet')}
                                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'fleet'
                                    ? 'bg-black text-white shadow-lg scale-105'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                My Fleet ({vehicles.length})
                            </button>
                        </div>

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 md:p-10 animate-fade-in">
                                {/* Rating Summary */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 items-center">
                                    <div className="text-center md:text-left">
                                        <div className="text-7xl font-black text-gray-900 mb-2 tracking-tighter">{displayRating}</div>
                                        <div className="flex items-center justify-center md:justify-start gap-1 text-yellow-400 mb-3 text-2xl">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span key={star}>{star <= Math.round(displayRating) ? '★' : '☆'}</span>
                                            ))}
                                        </div>
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Based on {displayCount} verified reviews</p>
                                    </div>
                                    <div className="space-y-3">
                                        {[5, 4, 3, 2, 1].map((star) => (
                                            <div key={star} className="flex items-center gap-4 group">
                                                <span className="text-sm font-bold w-4 text-gray-400 group-hover:text-gray-900 transition-colors">{star}</span>
                                                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-yellow-400 rounded-full transition-all duration-1000 ease-out"
                                                        style={{ width: `${stats && stats.total ? (stats[star] / stats.total) * 100 : 0}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-bold text-gray-400 w-8 text-right group-hover:text-gray-900 transition-colors">{stats ? stats[star] : 0}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Add Review Trigger */}
                                {!showReviewForm && (
                                    <button
                                        onClick={() => setShowReviewForm(true)}
                                        className="w-full py-5 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 font-bold hover:border-black hover:text-black hover:bg-gray-50 transition-all mb-10 flex items-center justify-center gap-3 group"
                                    >
                                        <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                        </span>
                                        Write a Review
                                    </button>
                                )}

                                {/* Review Form */}
                                {showReviewForm && (
                                    <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-2xl p-8 mb-10 border border-gray-200 animate-fade-in-up">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="font-bold text-xl text-gray-900">Your Review</h3>
                                            <button type="button" onClick={() => setShowReviewForm(false)} className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300 transition-colors">
                                                ✕
                                            </button>
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Rating</label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setNewRating(star)}
                                                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${star <= newRating ? 'bg-yellow-400 text-white shadow-lg scale-110' : 'bg-white text-gray-300 hover:bg-gray-100'}`}
                                                    >
                                                        ★
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Review</label>
                                            <textarea
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                rows="4"
                                                className="w-full px-5 py-4 rounded-xl border-0 bg-white shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-black placeholder:text-gray-400 transition-all font-medium text-gray-900 resize-none"
                                                placeholder="Share your experience..."
                                                required
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                                        >
                                            {submitting ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                )}

                                {/* Reviews List Grid for better readability */}
                                <div className="grid grid-cols-1 gap-8">
                                    {reviews.map((review) => (
                                        <div key={review._id} className="bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-100">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center font-bold text-gray-600 shadow-inner">
                                                        {review.reviewerId?.username?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 text-lg">{review.reviewerId?.username || 'User'}</div>
                                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">{formatDate(review.createdAt)}</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
                                                    <span className="font-black text-gray-900 text-sm">{review.rating}</span>
                                                    <span className="text-yellow-400 text-sm">★</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed font-medium">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    ))}
                                    {reviews.length === 0 && (
                                        <div className="text-center py-20">
                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📝</div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
                                            <p className="text-gray-500">Be the first to check out this host!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Fleet Tab */}
                        {activeTab === 'fleet' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                                {vehicles.map((vehicle) => (
                                    <Link key={vehicle._id} href={`/book/bike?id=${vehicle._id}`} className="group block bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-black/5 transition-all duration-500 hover:-translate-y-2">
                                        <div className="relative h-64 bg-gray-100 overflow-hidden">
                                            <img
                                                src={vehicle.vehiclePhoto}
                                                alt={vehicle.vehicleModel}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-gray-900 shadow-lg border border-white/50">
                                                {vehicle.fuelType || 'Petrol'}
                                            </div>
                                            <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-blue-600 transition-colors mb-1">{vehicle.vehicleModel}</h3>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{vehicle.vehicleType}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-end justify-between mt-6 pt-4 border-t border-gray-50">
                                                <div>
                                                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Price</span>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-2xl font-black text-gray-900">₹{vehicle.rentalPrice}</span>
                                                        <span className="text-sm text-gray-500 font-medium">/day</span>
                                                    </div>
                                                </div>
                                                <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                {vehicles.length === 0 && (
                                    <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border border-gray-100 border-dashed">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🚗</div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Vehicles</h3>
                                        <p className="text-gray-500">This host hasn't listed any vehicles yet.</p>
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
