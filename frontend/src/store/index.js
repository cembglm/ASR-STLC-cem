import { configureStore } from '@reduxjs/toolkit';
import codeReviewReducer from './slices/codeReviewSlice';

export const store = configureStore({
  reducer: {
    codeReview: codeReviewReducer,
  },
});
