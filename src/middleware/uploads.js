import express from 'express';
import path from 'path';

// Serve uploaded files statically
export const serveUploads = express.static('uploads', {
  maxAge: '1d', // Cache for 1 day
  etag: true
});