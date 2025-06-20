import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Post } from '../features/feed/components/PostCard';
import { feedService } from '../services/feed.service';

export interface FeedFilters {
  searchQuery: string;
  lastDays: number; // Number of days to look back from today
  college: string | null;
}

export interface FeedState {
  // Posts data
  posts: Post[]; // All accumulated posts for infinite scroll
  
  // Loading states
  isLoading: boolean;
  isLoadingMore: boolean;
  
  // Error state
  error: string | null;
  
  // Pagination (handled by backend)
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasMore: boolean;
  postsPerPage: number; // Backend returns 5 per page
  
  // Unauthenticated user limits
  maxPostsWithoutLogin: number;
  hasReachedLimit: boolean;
  modalShownAndDismissed: boolean; // Track if modal was shown and user dismissed it
  
  // Filters
  filters: FeedFilters;
  
  // Actions
  initializeFeed: (isAuthenticated: boolean) => void;
  loadMorePosts: (isAuthenticated: boolean) => void;
  applyFilters: (isAuthenticated: boolean) => void;
  updateFilter: <K extends keyof FeedFilters>(key: K, value: FeedFilters[K], isAuthenticated: boolean) => void;
  resetFilters: (isAuthenticated: boolean) => void;
  searchPosts: (query: string, isAuthenticated: boolean) => void;
  setDateRange: (lastDays: number, isAuthenticated: boolean) => void;
  setCollege: (college: string | null, isAuthenticated: boolean) => void;
  refreshFeed: (isAuthenticated: boolean) => void;
  markModalDismissed: () => void; // Action to mark modal as dismissed
}

const initialFilters: FeedFilters = {
  searchQuery: '',
  lastDays: 30, // Default to last 30 days
  college: null,
};

export const useFeedStore = create<FeedState>()(
  subscribeWithSelector((set, get) => ({
  // Initial state
  posts: [],
  isLoading: true,
  isLoadingMore: false,
  error: null,
  currentPage: 0,
  totalPages: 0,
  totalCount: 0,
  hasMore: true,
  postsPerPage: 5, // Backend returns 5 posts per page
    maxPostsWithoutLogin: 6, // Allow only 6 posts for unauthenticated users
  hasReachedLimit: false,
    modalShownAndDismissed: false,
  filters: initialFilters,
  
  // Initialize feed - load first page
  initializeFeed: async (isAuthenticated) => {
      const currentState = get();
      
      // Prevent multiple simultaneous initializations
      if (currentState.isLoading && currentState.posts.length === 0) {
        return;
      }
      
    set({ 
      isLoading: true, 
      error: null, 
      posts: [], 
      currentPage: 0, 
      hasMore: true, 
        hasReachedLimit: false,
        modalShownAndDismissed: false // Reset modal state on initialization
    });
    
    try {
      const response = await feedService.fetchPosts({
        ...get().filters,
        page: 1,
        limit: get().postsPerPage,
      });
      
      if (response.status) {
        const { posts, totalDocs, page, totalPages, hasNextPage } = response.data;
          
          // For unauthenticated users, limit the posts to maxPostsWithoutLogin
          let finalPosts = posts;
          if (!isAuthenticated && posts.length > get().maxPostsWithoutLogin) {
            finalPosts = posts.slice(0, get().maxPostsWithoutLogin);
          }
        
        // Check if unauthenticated user has reached limit
          const reachedLimit = !isAuthenticated && finalPosts.length >= get().maxPostsWithoutLogin;
        
        set({
            posts: finalPosts,
          totalCount: totalDocs,
          currentPage: page,
          totalPages,
          hasMore: hasNextPage && !reachedLimit,
          hasReachedLimit: reachedLimit,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          error: response.error || 'Failed to load posts',
          isLoading: false,
          posts: [],
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        isLoading: false,
        posts: [],
      });
    }
  },
  
  // Load more posts for infinite scroll
  loadMorePosts: async (isAuthenticated) => {
    const state = get();
      
      // Prevent loading more if user has reached limit and modal was dismissed
      if (!isAuthenticated && state.modalShownAndDismissed) {
        return;
      }
    
    if (!state.hasMore || state.isLoadingMore || state.isLoading || state.hasReachedLimit) {
      return;
    }
    
    set({ isLoadingMore: true, error: null });
    
    try {
      const nextPage = state.currentPage + 1;
      const response = await feedService.fetchPosts({
        ...state.filters,
        page: nextPage,
        limit: state.postsPerPage,
      });
      
      if (response.status) {
        const { posts: newPosts, totalDocs, page, totalPages, hasNextPage } = response.data;
        
        // Accumulate posts for infinite scroll
        const allPosts = [...state.posts, ...newPosts];
          
          // For unauthenticated users, limit the posts to maxPostsWithoutLogin
          let finalPosts = allPosts;
          if (!isAuthenticated && allPosts.length > state.maxPostsWithoutLogin) {
            finalPosts = allPosts.slice(0, state.maxPostsWithoutLogin);
          }
        
        // Check if unauthenticated user has reached limit
          const reachedLimit = !isAuthenticated && finalPosts.length >= state.maxPostsWithoutLogin;
        
        set({
            posts: finalPosts,
          totalCount: totalDocs,
          currentPage: page,
          totalPages,
          hasMore: hasNextPage && !reachedLimit,
          hasReachedLimit: reachedLimit,
          isLoadingMore: false,
          error: null,
        });
      } else {
        set({
          error: response.error || 'Failed to load more posts',
          isLoadingMore: false,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        isLoadingMore: false,
      });
    }
  },
  
  // Apply filters - reset and reload from page 1
  applyFilters: async (isAuthenticated) => {
    set({ 
      isLoading: true, 
      error: null, 
      posts: [], 
      currentPage: 0, 
      hasMore: true, 
        hasReachedLimit: false,
        modalShownAndDismissed: false // Reset modal state when applying filters
    });
    
    try {
      const response = await feedService.fetchPosts({
        ...get().filters,
        page: 1,
        limit: get().postsPerPage,
      });
      
      if (response.status) {
        const { posts, totalDocs, page, totalPages, hasNextPage } = response.data;
          
          // For unauthenticated users, limit the posts to maxPostsWithoutLogin
          let finalPosts = posts;
          if (!isAuthenticated && posts.length > get().maxPostsWithoutLogin) {
            finalPosts = posts.slice(0, get().maxPostsWithoutLogin);
          }
        
        // Check if unauthenticated user has reached limit
          const reachedLimit = !isAuthenticated && finalPosts.length >= get().maxPostsWithoutLogin;
        
        set({
            posts: finalPosts,
          totalCount: totalDocs,
          currentPage: page,
          totalPages,
          hasMore: hasNextPage && !reachedLimit,
          hasReachedLimit: reachedLimit,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          error: response.error || 'Failed to apply filters',
          isLoading: false,
          posts: [],
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        isLoading: false,
        posts: [],
      });
    }
  },
  
  // Update a specific filter and reload
  updateFilter: (key, value, isAuthenticated) => {
    set(state => ({
      filters: { ...state.filters, [key]: value }
    }));
    get().applyFilters(isAuthenticated);
  },
  
  // Reset all filters and reload
  resetFilters: (isAuthenticated) => {
    set({ filters: initialFilters });
    get().applyFilters(isAuthenticated);
  },
  
  // Search posts
  searchPosts: (query, isAuthenticated) => {
    get().updateFilter('searchQuery', query, isAuthenticated);
  },
  
  // Set date range
  setDateRange: (lastDays: number, isAuthenticated: boolean) => {
    get().updateFilter('lastDays', lastDays, isAuthenticated);
  },
  
  // Set college
  setCollege: (college, isAuthenticated) => {
    get().updateFilter('college', college, isAuthenticated);
  },
  
  // Refresh feed - reset and reload
  refreshFeed: async (isAuthenticated) => {
    set({ 
      isLoading: true, 
      error: null, 
      posts: [], 
      currentPage: 0, 
      hasMore: true, 
        hasReachedLimit: false,
        modalShownAndDismissed: false // Reset modal state when refreshing
    });
    
    try {
      const response = await feedService.fetchPosts({
        ...get().filters,
        page: 1,
        limit: get().postsPerPage,
      });
      
      if (response.status) {
        const { posts, totalDocs, page, totalPages, hasNextPage } = response.data;
          
          // For unauthenticated users, limit the posts to maxPostsWithoutLogin
          let finalPosts = posts;
          if (!isAuthenticated && posts.length > get().maxPostsWithoutLogin) {
            finalPosts = posts.slice(0, get().maxPostsWithoutLogin);
          }
        
        // Check if unauthenticated user has reached limit
          const reachedLimit = !isAuthenticated && finalPosts.length >= get().maxPostsWithoutLogin;
        
        set({
            posts: finalPosts,
          totalCount: totalDocs,
          currentPage: page,
          totalPages,
          hasMore: hasNextPage && !reachedLimit,
          hasReachedLimit: reachedLimit,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          error: response.error || 'Failed to refresh feed',
          isLoading: false,
          posts: [],
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        isLoading: false,
        posts: [],
      });
    }
  },
    
    // Mark modal as dismissed
    markModalDismissed: () => {
      set({ modalShownAndDismissed: true });
    },
  }))
); 