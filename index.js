'use strict';

/**
 * Load helpers
 */
const modelToObject = require('./helpers/model-to-object');
const matchCriteria = require('./helpers/match-criteria');

const getMatchFields = function (schema, matchFields) {
  // Use default match fields if none provided
  matchFields = matchFields || schema.options.upsertMatchFields;
  if (!Array.isArray(matchFields) || matchFields.length === 0) {
    matchFields = ['_id'];
  }
  return matchFields;
};

const generateFindBulk = function (items, matchFields, operation, upsert = true) {
  // Create bulk operation
  const bulk = this.collection.initializeUnorderedBulkOp();
  items
    .map(item => modelToObject(item, this))
    .forEach(item => {

      // Extract match criteria
      const match = matchCriteria(item, matchFields);

      // Add ops
      if (upsert) {
        // Can't have _id field when upserting item
        delete item._id;
        bulk.find(match).upsert()[operation](item);
      }
      else {
        // The argument item should be unused for remove() and removeOne()
        bulk.find(match)[operation](item);
      }
    });
  return bulk;
};

const execute = function (bulk) {
  // Execute bulk operation wrapped in promise
  return new Promise((resolve, reject) => {
    bulk.execute((error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

/**
 * Apply helpers to schema
 */
module.exports = function bulkOp(schema) {
  schema.statics.bulkUpsertReplaceOne = function (items, matchFields) {
    matchFields = getMatchFields(schema, matchFields);
    const bulk = generateFindBulk.call(this, items, matchFields, 'replaceOne', true);
    return execute(bulk);
  };

  schema.statics.bulkUpsertUpdateOne = function (items, matchFields) {
    matchFields = getMatchFields(schema, matchFields);
    const bulk = generateFindBulk.call(this, items, matchFields, 'updateOne', true);
    return execute(bulk);
  };

  schema.statics.bulkUpsertUpdate = function (items, matchFields) {
    matchFields = getMatchFields(schema, matchFields);
    const bulk = generateFindBulk.call(this, items, matchFields, 'update', true);
    return execute(bulk);
  };

  schema.statics.bulkReplaceOne = function (items, matchFields) {
    matchFields = getMatchFields(schema, matchFields);
    const bulk = generateFindBulk.call(this, items, matchFields, 'replaceOne', false);
    return execute(bulk);
  };

  schema.statics.bulkUpdateOne = function (items, matchFields) {
    matchFields = getMatchFields(schema, matchFields);
    const bulk = generateFindBulk.call(this, items, matchFields, 'updateOne', false);
    return execute(bulk);
  };

  schema.statics.bulkUpdate = function (items, matchFields) {
    matchFields = getMatchFields(schema, matchFields);
    const bulk = generateFindBulk.call(this, items, matchFields, 'update', false);
    return execute(bulk);
  };

  schema.statics.bulkRemoveOne = function (items, matchFields) {
    matchFields = getMatchFields(schema, matchFields);
    const bulk = generateFindBulk.call(this, items, matchFields, 'removeOne', false);
    return execute(bulk);
  };

  schema.statics.bulkRemove = function (items, matchFields) {
    matchFields = getMatchFields(schema, matchFields);
    const bulk = generateFindBulk.call(this, items, matchFields, 'remove', false);
    return execute(bulk);
  };

  schema.statics.bulkInsert = function (items) {
    // Create bulk operation
    const bulk = this.collection.initializeUnorderedBulkOp();
    items
      .map(item => modelToObject(item, this))
      .forEach(item => {
        // Can't have _id on insert
        delete item._id;
        bulk.insert(item);
      });

    return execute(bulk);
  };
};
