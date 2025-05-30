// Authentication hooks
export {
  useLogin,
  useSendEmailOtp,
  useVerifyEmail,
  useCurrentUser,
  useRequestPasswordReset,
  useResetPassword,
  useLogout,
  authKeys
} from './useAuth';

// User management hooks
export {
  useUser,
  useUpdateProfile,
  useDeleteAccount,
  userKeys
} from './useUsers';

// College hooks
export {
  useFeaturedColleges,
  useCollegeSearch,
  useCollege,
  collegeKeys
} from './useColleges'; 