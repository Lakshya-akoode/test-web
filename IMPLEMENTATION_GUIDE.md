# Error Handling & Reusable Utilities - Implementation Guide

This document explains how to use the newly created error handling system and reusable utilities in your ZugoWeb application.

## 🎯 What Was Created

### 1. **ErrorBoundary Component** (`src/components/ErrorBoundary.js`)
Catches JavaScript errors anywhere in the component tree and displays a fallback UI.

### 2. **Toast Notification System** (`src/components/Toast.js`)
Provides consistent toast notifications across the application.

### 3. **Authentication Hook** (`src/hooks/useAuth.js`)
Centralized authentication management with automatic redirects.

### 4. **Loading Hook** (`src/hooks/useLoading.js`)
Standardized loading state management.

### 5. **Formatters** (`src/utils/formatters.js`)
Utility functions for formatting dates, currency, and other data.

### 6. **Error Handler** (`src/utils/errorHandler.js`)
Centralized error processing and handling.

### 7. **withAuth HOC** (`src/components/withAuth.js`)
Higher-order component for protecting routes.

---

## 📚 Usage Examples

### Using Toast Notifications

Replace all `alert()` calls with toast notifications:

**Before:**
```javascript
alert('Booking cancelled successfully');
alert('Failed to cancel booking');
```

**After:**
```javascript
import { useToast } from '@/components/Toast';

function MyComponent() {
    const toast = useToast();

    const handleCancel = async () => {
        try {
            await cancelBooking();
            toast.success('Booking cancelled successfully');
        } catch (error) {
            toast.error('Failed to cancel booking');
        }
    };
}
```

### Using useAuth Hook

Replace repeated authentication logic:

**Before:**
```javascript
useEffect(() => {
    if (!isAuthenticated()) {
        router.push('/login');
        return;
    }
    const currentUser = getUser();
    setUser(currentUser);
}, []);
```

**After:**
```javascript
import { useRequireAuth } from '@/hooks/useAuth';

function MyPage() {
    const { user, loading, logout } = useRequireAuth();
    
    if (loading) return <LoadingSpinner />;
    
    return <div>Welcome {user.username}</div>;
}
```

### Using useLoading Hook

Standardize loading states:

**Before:**
```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
        const data = await api.getData();
        // process data
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};
```

**After:**
```javascript
import { useLoading } from '@/hooks/useLoading';
import { useToast } from '@/components/Toast';

function MyComponent() {
    const { loading, withLoading } = useLoading();
    const toast = useToast();

    const fetchData = async () => {
        await withLoading(async () => {
            const data = await api.getData();
            return data;
        }, {
            onError: (error) => {
                toast.error('Failed to load data');
            }
        });
    };
}
```

### Using Formatters

Replace inline formatting:

**Before:**
```javascript
<p>₹{booking.totalAmount}</p>
<p>{new Date(booking.startDate).toLocaleDateString('en-IN', {...})}</p>
```

**After:**
```javascript
import { formatCurrency, formatDate } from '@/utils/formatters';

<p>{formatCurrency(booking.totalAmount)}</p>
<p>{formatDate(booking.startDate)}</p>
```

### Using withAuth HOC

Protect pages with HOC:

**Before:**
```javascript
// In every protected page
useEffect(() => {
    if (!isAuthenticated()) {
        router.push('/login');
    }
}, []);
```

**After:**
```javascript
import withAuth from '@/components/withAuth';

function MyProtectedPage() {
    return <div>Protected Content</div>;
}

export default withAuth(MyProtectedPage);
```

For admin pages:
```javascript
import { withAdminAuth } from '@/components/withAuth';

export default withAdminAuth(AdminDashboard);
```

### Using Error Handler

Consistent API error handling:

**Before:**
```javascript
try {
    await fetch(API.endpoint);
} catch (error) {
    console.error('Error:', error);
    alert('Something went wrong');
}
```

**After:**
```javascript
import { handleApiError } from '@/utils/errorHandler';
import { useToast } from '@/components/Toast';

const toast = useToast();

try {
    const response = await fetch(API.endpoint);
} catch (error) {
    handleApiError(error, {
        showToast: true,
        toast,
        context: { operation: 'fetchBookings' }
    });
}
```

---

## 🔄 Migration Checklist

### High Priority (Do First)
- [ ] Update `bookings/[id]/page.js` - Replace alert() with toast
- [ ] Update `login/page.js` - Use useGuestOnly hook
- [ ] Update `admin/dashboard/page.js` - Use withAdminAuth
- [ ] Update all booking pages - Use formatDate and formatCurrency

### Medium Priority
- [ ] Migrate all protected pages to use withAuth HOC
- [ ] Replace all authentication checks with useAuth hook
- [ ] Replace all alert() calls with toast notifications
- [ ] Use error handler for all API calls

### Low Priority
- [ ] Add error boundaries around complex components
- [ ] Implement retry logic for critical API calls
- [ ] Add loading states using useLoading hook

---

## 🎨 Toast Types

```javascript
toast.success('Operation successful!');
toast.error('Something went wrong');
toast.warning('Please review your input');
toast.info('Just letting you know...');
```

---

## 🔒 Route Protection Options

```javascript
// Basic protection
export default withAuth(MyPage);

// With custom redirect
export default withAuth(MyPage, { redirectTo: '/custom-login' });

// Admin only
export default withAdminAuth(AdminPage);

// Guest only (login/register)
export default withGuestOnly(LoginPage, '/home');
```

---

## ✅ Benefits

1. **Consistency**: All error messages and loading states look the same
2. **Maintainability**: Change behavior in one place
3. **Better UX**: Professional toast notifications instead of alert()
4. **Type Safety**: Centralized formatters prevent formatting errors
5. **Security**: Proper error handling prevents information leakage
6. **Code Reduction**: Eliminates duplicate code across pages

---

## 🚀 Next Steps

1. Start migrating critical pages (bookings, payment)
2. Replace all alert() calls
3. Update authentication checks
4. Test error boundary by throwing errors in dev mode
5. Monitor console for any migration issues
