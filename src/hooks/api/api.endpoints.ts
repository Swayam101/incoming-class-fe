/**
 * Centralized API endpoint definitions
 * 
 * Structure:
 * - Each module (auth, users, etc.) has its own object with endpoints
 * - Endpoints are defined with their paths
 * - This makes it easy to update endpoint paths in one place
 */

const API_ENDPOINTS = {
  auth: {
    sendEmailOtp: "/auth/send-email-otp",
    signup: '/auth/verify-email-otp',
    login: '/auth/login',
    verifyMail: '/auth/verify-email',
    me: '/auth/me',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    logout: '/auth/logout',
  },

  users: {
    base: '/users',
    getById: (id: string) => `/users/${id}`,
    updateProfile: (id: string) => `/users/${id}`,
    deleteAccount: (id: string) => `/users/${id}`,
  },

  colleges: {
    base: '/colleges',
    getById: (id: string) => `/colleges/${id}`,
    search: '/colleges/search',
    featured: '/colleges/featured',
  },

  posts: {
    base: '/posts',
    getById: (id: string) => `/posts/${id}`,
    byUser: (userId: string) => `/posts/user/${userId}`,
    comments: (postId: string) => `/posts/${postId}/comments`,
  }
};

export default API_ENDPOINTS; 