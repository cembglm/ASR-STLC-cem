import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { processService } from '../../services/processService';

export const runCodeReview = createAsyncThunk(
  'codeReview/runReview',
  async ({files, model}) => {
    try {
      // Show the selected model in an alert
      window.alert(`Selected model: ${model}`);
      
      const response = await processService.runCodeReview(files, model);
      if (!response || !response.reviews) {
        throw new Error('Invalid response format');
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const codeReviewSlice = createSlice({
  name: 'codeReview',
  initialState: {
    reviews: [],
    metadata: null,
    status: 'idle',
    error: null,
    history: [] // Review geçmişini tutmak için
  },
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
      state.status = 'idle';
      state.error = null;
    },
    // Yeni reducer'lar
    addToHistory: (state) => {
      state.history.push({
        reviews: state.reviews,
        metadata: state.metadata,
        timestamp: new Date().toISOString()
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(runCodeReview.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(runCodeReview.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reviews = action.payload.reviews;
        state.metadata = action.payload.metadata;
        state.error = null;
      })
      .addCase(runCodeReview.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { clearReviews } = codeReviewSlice.actions;
export default codeReviewSlice.reducer;