
// Import the builder SDK
import { builder } from '@builder.io/react';

// Replace this API key with your own public Builder.io key
// You'll need to register on builder.io to get a key
export const BUILDER_API_KEY = 'YOUR_API_KEY';

// Initialize Builder.io
export const initBuilder = () => {
  builder.init(BUILDER_API_KEY);
};

// You can add additional configurations here

