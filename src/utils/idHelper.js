import mongoose from 'mongoose';

/**
 * Builds a MongoDB query filter that matches a document by _id,
 * handling the Mixed _id type issue where _id could be stored as
 * either an ObjectId or a string.
 * 
 * @param {string} id - The ID string from req.params
 * @returns {object} MongoDB query filter using $or for both types
 */
export const buildIdFilter = (id) => {
  const objectId = mongoose.Types.ObjectId.isValid(id) 
    ? new mongoose.Types.ObjectId(id) 
    : id;
  return { $or: [{ _id: objectId }, { _id: id }] };
};

/**
 * Strips internal/system fields from request body before updating.
 * Prevents _id conflicts and accidental overwrites of timestamps.
 * 
 * @param {object} body - The request body (req.body)
 * @returns {object} Cleaned data safe for MongoDB update
 */
export const cleanUpdateData = (body) => {
  const { _id, createdAt, updatedAt, __v, ...data } = body;
  return data;
};

/**
 * Builds an exclusion filter for checking duplicates (e.g., slug uniqueness).
 * Excludes the current document by both ObjectId and string _id.
 * 
 * @param {string} id - The current document's ID to exclude
 * @returns {object} MongoDB filter to exclude this document
 */
export const excludeIdFilter = (id) => {
  const objectId = mongoose.Types.ObjectId.isValid(id) 
    ? new mongoose.Types.ObjectId(id) 
    : id;
  return { $nin: [id, objectId] };
};
