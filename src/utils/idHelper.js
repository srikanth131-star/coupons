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
  if (mongoose.Types.ObjectId.isValid(id)) {
    const objectId = new mongoose.Types.ObjectId(id);
    return { $or: [{ _id: objectId }, { _id: id }] };
  }
  return { _id: id };
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

/**
 * Delete a document using native MongoDB driver to bypass Mongoose casting.
 * Used when documents may have been created with _id: Mixed schema.
 * 
 * @param {string} collectionName - MongoDB collection name
 * @param {string} id - Document ID to delete
 * @returns {object} { deleted: boolean, doc: object|null }
 */
export const nativeDeleteById = async (collectionName, id) => {
  const db = mongoose.connection.db;
  const collection = db.collection(collectionName);
  
  const objectId = mongoose.Types.ObjectId.isValid(id) 
    ? new mongoose.Types.ObjectId(id) 
    : null;
  
  const filter = objectId 
    ? { $or: [{ _id: objectId }, { _id: id }] }
    : { _id: id };
  
  const doc = await collection.findOneAndDelete(filter);
  return { deleted: !!doc, doc };
};

/**
 * Find a document using native MongoDB driver to bypass Mongoose casting.
 * 
 * @param {string} collectionName - MongoDB collection name
 * @param {string} id - Document ID to find
 * @returns {object|null}
 */
export const nativeFindById = async (collectionName, id) => {
  const db = mongoose.connection.db;
  const collection = db.collection(collectionName);
  
  const objectId = mongoose.Types.ObjectId.isValid(id) 
    ? new mongoose.Types.ObjectId(id) 
    : null;
  
  const filter = objectId 
    ? { $or: [{ _id: objectId }, { _id: id }] }
    : { _id: id };
  
  return await collection.findOne(filter);
};

/**
 * Update a document using native MongoDB driver to bypass Mongoose casting.
 * 
 * @param {string} collectionName - MongoDB collection name
 * @param {string} id - Document ID to update
 * @param {object} data - Fields to update
 * @returns {object|null}
 */
export const nativeUpdateById = async (collectionName, id, data) => {
  const db = mongoose.connection.db;
  const collection = db.collection(collectionName);
  
  const objectId = mongoose.Types.ObjectId.isValid(id) 
    ? new mongoose.Types.ObjectId(id) 
    : null;
  
  const filter = objectId 
    ? { $or: [{ _id: objectId }, { _id: id }] }
    : { _id: id };
  
  const result = await collection.findOneAndUpdate(
    filter, 
    { $set: { ...data, updatedAt: new Date() } }, 
    { returnDocument: 'after' }
  );
  return result;
};
