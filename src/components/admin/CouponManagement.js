'use client';

import { useState, useEffect } from 'react';
import { API } from '@/lib/api';
import { getAdminAuthHeaders } from '@/lib/adminAuth';

export default function CouponManagement() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [creating, setCreating] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');

    // Form state
    const [form, setForm] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        maxDiscount: '',
        minOrderAmount: '',
        validFrom: new Date().toISOString().split('T')[0],
        validTo: '',
        maxUsage: '',
        maxUsagePerUser: '1',
        applicableCategories: [],
        firstRideOnly: false,
        description: ''
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    // Auto-dismiss success messages
    useEffect(() => {
        if (successMsg) {
            const timer = setTimeout(() => setSuccessMsg(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMsg]);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await fetch(API.adminCoupons, {
                headers: getAdminAuthHeaders()
            });
            const data = await response.json();

            if (data.status === 'Success') {
                setCoupons(data.data || []);
            } else {
                setError(data.message || 'Failed to load coupons');
            }
        } catch (err) {
            console.error('Error fetching coupons:', err);
            setError('An error occurred while loading coupons');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        setCreating(true);
        setError('');

        try {
            const payload = {
                code: form.code.toUpperCase().trim(),
                discountType: form.discountType,
                discountValue: Number(form.discountValue),
                maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
                minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
                validFrom: form.validFrom,
                validTo: form.validTo,
                maxUsage: form.maxUsage ? Number(form.maxUsage) : null,
                maxUsagePerUser: Number(form.maxUsagePerUser) || 1,
                applicableCategories: form.applicableCategories,
                firstRideOnly: form.firstRideOnly,
                description: form.description
            };

            const response = await fetch(API.adminCreateCoupon, {
                method: 'POST',
                headers: getAdminAuthHeaders(),
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.status === 'Success') {
                setSuccessMsg('Coupon created successfully!');
                setShowCreateForm(false);
                resetForm();
                fetchCoupons();
            } else {
                setError(data.message || 'Failed to create coupon');
            }
        } catch (err) {
            console.error('Error creating coupon:', err);
            setError('An error occurred while creating the coupon');
        } finally {
            setCreating(false);
        }
    };

    const handleToggle = async (id) => {
        try {
            const response = await fetch(`${API.adminToggleCoupon}/${id}/toggle`, {
                method: 'PUT',
                headers: getAdminAuthHeaders()
            });
            const data = await response.json();

            if (data.status === 'Success') {
                setCoupons(prev =>
                    prev.map(c => c._id === id ? { ...c, isActive: !c.isActive } : c)
                );
                setSuccessMsg(data.message);
            } else {
                setError(data.message || 'Failed to toggle coupon');
            }
        } catch (err) {
            console.error('Error toggling coupon:', err);
            setError('An error occurred');
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API.adminDeleteCoupon}/${id}`, {
                method: 'DELETE',
                headers: getAdminAuthHeaders()
            });
            const data = await response.json();

            if (data.status === 'Success') {
                setCoupons(prev => prev.filter(c => c._id !== id));
                setDeleteConfirm(null);
                setSuccessMsg('Coupon deleted successfully');
            } else {
                setError(data.message || 'Failed to delete coupon');
            }
        } catch (err) {
            console.error('Error deleting coupon:', err);
            setError('An error occurred');
        }
    };

    const resetForm = () => {
        setForm({
            code: '',
            discountType: 'percentage',
            discountValue: '',
            maxDiscount: '',
            minOrderAmount: '',
            validFrom: new Date().toISOString().split('T')[0],
            validTo: '',
            maxUsage: '',
            maxUsagePerUser: '1',
            applicableCategories: [],
            firstRideOnly: false,
            description: ''
        });
    };

    const handleCategoryToggle = (cat) => {
        setForm(prev => ({
            ...prev,
            applicableCategories: prev.applicableCategories.includes(cat)
                ? prev.applicableCategories.filter(c => c !== cat)
                : [...prev.applicableCategories, cat]
        }));
    };

    const isExpired = (validTo) => new Date(validTo) < new Date();
    const isUpcoming = (validFrom) => new Date(validFrom) > new Date();

    const getStatusInfo = (coupon) => {
        if (!coupon.isActive) return { label: 'Inactive', color: 'bg-gray-100 text-gray-600' };
        if (isExpired(coupon.validTo)) return { label: 'Expired', color: 'bg-red-50 text-red-600' };
        if (isUpcoming(coupon.validFrom)) return { label: 'Scheduled', color: 'bg-blue-50 text-blue-600' };
        return { label: 'Active', color: 'bg-emerald-50 text-emerald-700' };
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Success Toast */}
            {successMsg && (
                <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2 animate-slideIn">
                    <span className="text-lg">✅</span> {successMsg}
                </div>
            )}

            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 text-sm flex items-center justify-between">
                    <span>⚠️ {error}</span>
                    <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 text-lg font-bold">×</button>
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Coupons & Discounts</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage promotional coupons for your platform
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                        Total: {coupons.length}
                    </span>
                    <button
                        onClick={() => { setShowCreateForm(true); resetForm(); }}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                        <span className="text-lg">＋</span> Create Coupon
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Active', value: coupons.filter(c => c.isActive && !isExpired(c.validTo)).length, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: '✅' },
                    { label: 'Expired', value: coupons.filter(c => isExpired(c.validTo)).length, color: 'text-red-600', bg: 'bg-red-50', icon: '⏰' },
                    { label: 'Inactive', value: coupons.filter(c => !c.isActive).length, color: 'text-gray-600', bg: 'bg-gray-50', icon: '⏸️' },
                    { label: 'Total Uses', value: coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0), color: 'text-blue-600', bg: 'bg-blue-50', icon: '🎯' },
                ].map((stat) => (
                    <div key={stat.label} className={`${stat.bg} rounded-xl p-4 border border-gray-100`}>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{stat.icon}</span>
                            <div>
                                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Coupon Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-2xl flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Create New Coupon</h3>
                                <p className="text-sm text-gray-500 mt-0.5">Fill in the details to create a promotional coupon</p>
                            </div>
                            <button
                                onClick={() => setShowCreateForm(false)}
                                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreateCoupon} className="p-6 space-y-5">
                            {/* Code & Type */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Coupon Code *</label>
                                    <input
                                        type="text"
                                        value={form.code}
                                        onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                        placeholder="e.g., WELCOME10"
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-mono tracking-wider uppercase"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Discount Type *</label>
                                    <select
                                        value={form.discountType}
                                        onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="flat">Flat Amount (₹)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Values */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Discount Value * {form.discountType === 'percentage' ? '(%)' : '(₹)'}
                                    </label>
                                    <input
                                        type="number"
                                        value={form.discountValue}
                                        onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                                        placeholder={form.discountType === 'percentage' ? 'e.g., 10' : 'e.g., 200'}
                                        required
                                        min="0"
                                        max={form.discountType === 'percentage' ? '100' : undefined}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                    />
                                </div>
                                {form.discountType === 'percentage' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Max Discount Cap (₹)</label>
                                        <input
                                            type="number"
                                            value={form.maxDiscount}
                                            onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                                            placeholder="e.g., 200"
                                            min="0"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Min Order Amount (₹)</label>
                                    <input
                                        type="number"
                                        value={form.minOrderAmount}
                                        onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                                        placeholder="e.g., 500"
                                        min="0"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                    />
                                </div>
                            </div>

                            {/* Validity */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Valid From *</label>
                                    <input
                                        type="date"
                                        value={form.validFrom}
                                        onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Valid To *</label>
                                    <input
                                        type="date"
                                        value={form.validTo}
                                        onChange={(e) => setForm({ ...form, validTo: e.target.value })}
                                        required
                                        min={form.validFrom}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                    />
                                </div>
                            </div>

                            {/* Usage Limits */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Total Usage Limit
                                        <span className="font-normal text-gray-400 ml-1">(blank = unlimited)</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={form.maxUsage}
                                        onChange={(e) => setForm({ ...form, maxUsage: e.target.value })}
                                        placeholder="e.g., 100"
                                        min="1"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Per-User Limit</label>
                                    <input
                                        type="number"
                                        value={form.maxUsagePerUser}
                                        onChange={(e) => setForm({ ...form, maxUsagePerUser: e.target.value })}
                                        placeholder="1"
                                        min="1"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                    />
                                </div>
                            </div>

                            {/* Categories & Options */}
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-gray-700">Applicable Categories</label>
                                <div className="flex gap-3">
                                    {['2-wheeler', '4-wheeler'].map(cat => (
                                        <button
                                            type="button"
                                            key={cat}
                                            onClick={() => handleCategoryToggle(cat)}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                                                form.applicableCategories.includes(cat)
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                                            }`}
                                        >
                                            {cat === '2-wheeler' ? '🏍️' : '🚗'} {cat}
                                        </button>
                                    ))}
                                    <span className="text-xs text-gray-400 self-center ml-2">
                                        (none selected = applies to all)
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-amber-50 rounded-xl p-4 border border-amber-100">
                                <input
                                    type="checkbox"
                                    id="firstRideOnly"
                                    checked={form.firstRideOnly}
                                    onChange={(e) => setForm({ ...form, firstRideOnly: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="firstRideOnly" className="text-sm font-medium text-amber-800 cursor-pointer">
                                    🆕 First ride only — This coupon will only work for users who have never booked before
                                </label>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="e.g., Welcome offer - 10% off on your first ride!"
                                    rows="2"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateForm(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {creating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        '🎟️ Create Coupon'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center space-y-4">
                        <div className="w-14 h-14 mx-auto bg-red-100 rounded-full flex items-center justify-center text-2xl">🗑️</div>
                        <h3 className="text-lg font-bold text-gray-800">Delete Coupon?</h3>
                        <p className="text-sm text-gray-500">
                            Are you sure you want to delete coupon <strong className="font-mono">{deleteConfirm.code}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm._id)}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition text-sm font-semibold"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Coupons Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Code</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Discount</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Validity</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Usage</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-xs uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {coupons.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center">
                                        <div className="text-4xl mb-3">🎟️</div>
                                        <p className="text-gray-500 font-medium">No coupons created yet</p>
                                        <p className="text-gray-400 text-sm mt-1">Click "Create Coupon" to add your first one</p>
                                    </td>
                                </tr>
                            ) : (
                                coupons.map((coupon) => {
                                    const status = getStatusInfo(coupon);
                                    return (
                                        <tr key={coupon._id} className="hover:bg-gray-50/50 transition-colors">
                                            {/* Code */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-md">
                                                        {coupon.discountType === 'percentage' ? '%' : '₹'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800 font-mono tracking-wider text-sm">
                                                            {coupon.code}
                                                        </p>
                                                        {coupon.description && (
                                                            <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">
                                                                {coupon.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Discount */}
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {coupon.discountType === 'percentage'
                                                        ? `${coupon.discountValue}% off`
                                                        : `₹${coupon.discountValue} off`
                                                    }
                                                </p>
                                                <div className="text-xs text-gray-400 mt-0.5 space-y-0.5">
                                                    {coupon.maxDiscount && (
                                                        <p>Max: ₹{coupon.maxDiscount}</p>
                                                    )}
                                                    {coupon.minOrderAmount > 0 && (
                                                        <p>Min order: ₹{coupon.minOrderAmount}</p>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Validity */}
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-700">
                                                    {new Date(coupon.validFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                    {' → '}
                                                    {new Date(coupon.validTo).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                                {coupon.applicableCategories?.length > 0 && (
                                                    <div className="flex gap-1 mt-1">
                                                        {coupon.applicableCategories.map(cat => (
                                                            <span key={cat} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                                                {cat}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                {coupon.firstRideOnly && (
                                                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full mt-1 inline-block">
                                                        1st ride only
                                                    </span>
                                                )}
                                            </td>

                                            {/* Usage */}
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-gray-800">
                                                    {coupon.usedCount || 0}
                                                    <span className="text-gray-400 font-normal">
                                                        {' / '}{coupon.maxUsage || '∞'}
                                                    </span>
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {coupon.maxUsagePerUser || 1}/user
                                                </p>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleToggle(coupon._id)}
                                                        title={coupon.isActive ? 'Deactivate' : 'Activate'}
                                                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all text-sm ${
                                                            coupon.isActive
                                                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                                                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                                                        }`}
                                                    >
                                                        {coupon.isActive ? '⏸️' : '▶️'}
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(coupon)}
                                                        title="Delete coupon"
                                                        className="w-9 h-9 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-all text-sm"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Inline animation style */}
            <style jsx>{`
                @keyframes slideIn {
                    from { transform: translateX(100px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
