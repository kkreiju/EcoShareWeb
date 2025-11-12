# Admin Panel Implementation Guide

## Overview
This document describes the complete implementation of the admin panel for EcoShare, including all features, API integrations, and utilities.

## Architecture

### File Structure
```
lib/
  services/
    adminService.ts          # Core admin API service
  utils/
    admin-utils.ts          # Admin utility functions
    
hooks/
  use-admin.ts              # Custom React hooks for admin data

components/admin/
  dashboard/
    admin-dashboard-view.tsx
  users/
    admin-users-view.tsx
    admin-users-table.tsx
  reports/
    admin-reports-view.tsx
    admin-reports-table.tsx
  settings/
    admin-settings-view.tsx
```

## Features Implemented

### 1. Dashboard (`/admin/dashboard`)
- **Real-time Statistics**: Displays total reports, pending reports, and resolved reports
- **Recent Reports**: Shows the 10 most recent reports with details
- **Auto-refresh**: Manual refresh button available
- **Error Handling**: User-friendly error messages with toast notifications

**API Endpoint**: `GET /api/admin/get-reports?admin_id={admin_id}`

### 2. User Management (`/admin/users`)
- **User List**: Displays all users (excluding admins)
- **User Statistics**: Shows total, active, inactive, and suspended user counts
- **Status Management**: 
  - Activate (Free or Premium)
  - Deactivate (Free or Premium)
  - Suspend
- **Real-time Updates**: Status changes are immediately reflected
- **Search & Filter**: Ready for future implementation

**API Endpoints**:
- `GET /api/admin/user-management/get-users?admin_id={admin_id}`
- `POST /api/admin/user-management/manage-users`

### 3. Reports Management (`/admin/reports`)
- **Report List**: Displays all reports (user and listing reports)
- **Report Statistics**: Shows total, user reports, listing reports, and pending reviews
- **Report Details**: Includes reporter information, reported content, reason, and description
- **Status Management**: 
  - Investigate
  - Resolve
  - Dismiss
  - ⚠️ **Note**: Status updates are currently local-only (backend endpoint not available)

**API Endpoint**: `GET /api/admin/get-reports?admin_id={admin_id}`

### 4. Settings (`/admin/settings`)
- **Password Change**: Allows admins to change their password
- **Form Validation**: Validates password requirements
- **Success/Error Feedback**: Toast notifications for user feedback

**API Endpoint**: `PUT /api/user/change-password`

## Core Services

### `adminService.ts`
Main service file containing all admin API functions:

#### Functions:
- `getAdminId()`: Retrieves admin ID from current session
- `getReports(adminId)`: Fetches all reports
- `getUsers(adminId)`: Fetches all users (excluding admins)
- `manageUser(adminId, userId, action, deactivatePeriod?)`: Manages user accounts
- `mapMembershipStatusToUserStatus(status)`: Maps backend status to frontend status
- `getActionForStatusChange(currentStatus, desiredStatus)`: Determines API action needed
- `isAdminId(userId)`: Checks if a user ID is an admin ID
- `formatMembershipStatus(status)`: Formats membership status for display

#### Error Handling:
- Network error detection
- API error parsing
- Response validation
- User-friendly error messages

### `admin-utils.ts`
Utility functions for admin operations:

#### Formatting Functions:
- `formatAdminDate()`: Formats dates for admin tables
- `formatRelativeTime()`: Formats relative time (e.g., "2 hours ago")
- `formatUserName()`: Formats user names
- `getUserInitials()`: Gets user initials for avatars
- `formatUserMembershipStatus()`: Formats membership status with details

#### UI Helpers:
- `getStatusBadgeColor()`: Returns CSS classes for status badges
- `getPriorityBadgeColor()`: Returns CSS classes for priority badges

#### Data Operations:
- `filterUsers()`: Filters users by search query
- `filterReports()`: Filters reports by search query
- `sortByDate()`: Sorts items by date
- `paginate()`: Paginates arrays
- `exportToCSV()`: Exports data to CSV format

### `use-admin.ts`
Custom React hooks for easier data management:

- `useAdmin()`: Manages admin ID and authentication state
- `useAdminReports(adminId)`: Fetches and manages reports
- `useAdminUsers(adminId)`: Fetches and manages users

## Data Mapping

### Backend to Frontend Mapping

#### Reports:
```
Backend Field          → Frontend Field
─────────────────────────────────────────
report_id             → report_id
rep_reason            → reason
rep_status            → status (mapped)
rep_otherComments     → description
list_id               → type (determines user/listing)
created_at            → report_date
```

#### Users:
```
Backend Field          → Frontend Field
─────────────────────────────────────────
user_id               → user_id
user_email            → user_email
user_firstName        → firstName
user_lastName         → lastName
user_profileURL       → user_profileURL
user_membershipStatus → user_status (mapped)
created_at            → user_createdAt
```

### Status Mapping

#### User Status:
- `"Free"` or `"Premium"` → `"active"`
- `"Suspend"` → `"suspended"`
- `"DeactivateFree"` or `"DeactivatePremium"` → `"inactive"`

#### Report Status:
- `"Pending"` → `"pending"`
- `"Investigating"` → `"investigating"`
- `"Resolved"` → `"resolved"`
- `"Dismissed"` → `"dismissed"`

## Authentication

### Admin ID Format
Admin users have user IDs matching the pattern: `A\d{5}` (e.g., `A00087`, `A00005`)

### Access Control
- Admin layout (`app/admin/layout.tsx`) automatically checks if user is admin
- Non-admin users are redirected to `/user/dashboard`
- All API calls require valid admin ID

## API Integration

### Base URL
The frontend uses Next.js rewrites to proxy API calls:
- Frontend: `/api/*`
- Backend: `https://api-ecoshare.vercel.app/api/*`

### Request Format
All admin API requests include:
- `admin_id` query parameter (GET requests)
- `admin_id` in request body (POST requests)

### Response Format
All admin API responses follow:
```typescript
{
  success: boolean;
  [data fields...]
  error?: string;
}
```

## Error Handling

### Error Types
1. **Network Errors**: Connection failures, timeouts
2. **API Errors**: Invalid admin ID, unauthorized access, server errors
3. **Validation Errors**: Invalid data format, missing fields

### Error Display
- Toast notifications for user feedback
- Alert components for persistent errors
- Console logging for debugging

## Future Enhancements

### Recommended Features:
1. **Search & Filter**: Add search functionality to users and reports tables
2. **Pagination**: Implement pagination for large datasets
3. **Bulk Actions**: Allow bulk user management operations
4. **Export**: Add CSV/Excel export functionality (utility already created)
5. **Report Status Update**: Implement backend endpoint for updating report status
6. **Activity Log**: Track admin actions
7. **Analytics**: Add charts and graphs for better insights
8. **Notifications**: Real-time notifications for new reports

### Backend Requirements:
- Report status update endpoint (`PUT /api/admin/reports/{report_id}/status`)
- Enhanced report details (join with User/Listing tables)
- Admin activity logging

## Testing Checklist

- [ ] Login as admin user (ID starting with 'A')
- [ ] View dashboard statistics
- [ ] View and refresh reports
- [ ] View user list
- [ ] Change user status (activate/deactivate/suspend)
- [ ] Change admin password
- [ ] Test error scenarios (network errors, invalid admin ID)
- [ ] Test with empty data sets
- [ ] Test with large data sets

## Troubleshooting

### Common Issues:

1. **"Admin access required" error**
   - Verify user ID matches admin pattern (`A\d{5}`)
   - Check if user is logged in
   - Verify session is valid

2. **API calls failing**
   - Check network connection
   - Verify backend API is accessible
   - Check browser console for detailed errors

3. **Data not loading**
   - Check admin ID is valid
   - Verify API responses in Network tab
   - Check for CORS issues

## Notes

- All admin components are client-side (`"use client"`)
- Admin ID is automatically retrieved from session
- All API calls use the Next.js proxy (no CORS issues)
- Error handling is comprehensive with user-friendly messages
- Type safety is maintained throughout with TypeScript

