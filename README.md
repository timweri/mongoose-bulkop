# mongoose-bulkop

[![npm version](https://img.shields.io/npm/v/mongoose-bulkop.svg)](https://www.npmjs.com/package/mongoose-bulkop)
[![node dependencies](https://david-dm.org/timweri/mongoose-bulkop.svg)](https://david-dm.org/timweri/mongoose-bulkop)
[![github issues](https://img.shields.io/github/issues/timweri/mongoose-bulkop.svg)](https://github.com/timweri/mongoose-bulkop/issues)

A plugin that adds bulk operations to Mongoose schemas.

## Features
This plugin will expose multiple static bulk operation methods on your models which you can use to perform bulk operations while still making use of Mongoose's middlewares and validatiors.

The supported bulk operations are:
* `Bulk.find.remove`
* `Bulk.find.removeOne`
* `Bulk.find.replaceOne` and `Bulk.find.upsert.replaceOne`
* `Bulk.find.updateOne` and `Bulk.find.upsert.updateOne`
* `Bulk.find.update` and `Bulk.find.upsert.update`
* `Bulk.insert`

Details about these operations can be found at https://docs.mongodb.com/manual/reference/method/js-bulk/.

## Installation

## Usage
Setup as a global plugin for all Mongoose schema's:

```js
const mongoose = require('mongoose');
const bulkOp = require('mongoose-bulkop');

mongoose.plugin(bulkOp);
```

Or for a specific (sub) schema:

```js
const mongoose = require('mongoose');
const bulkOp = require('mongoose-bulkop');
const {Schema} = mongoose;

const MySchema = new Schema({});
MySchema.plugin(bulkOp);
```

This plugin will expose the following static methods on your models:
* `bulkUpsertReplaceOne(items, matchFields)`
* `bulkUpsertUpdateOne(items, matchFields)`
* `bulkUpsertUpdate(items, matchFields)`
* `bulkReplaceOne(items, matchFields)`
* `bulkUpdateOne(items, matchFields)`
* `bulkUpdate(items, matchFields)`
* `bulkRemoveOne(items, matchFields)`
* `bulkRemove(items, matchFields)`
* `bulkInsert(items)`

where

* `items` is the array of items you would want to remove from, update, replace or insert into the collection.
* `matchFields` is an array of field names that will be processed and passed to `Bulk.find` to identify which items to execute the remove, update or replace operation on.

The return value of these methods is an [`BulkWriteResult()`](https://docs.mongodb.com/manual/reference/method/Bulk.execute/) object that contains information about the bulk operations:
```js
BulkWriteResult({
   "writeErrors" : [ ],
   "writeConcernErrors" : [ ],
   "nInserted" : 2,
   "nUpserted" : 0,
   "nMatched" : 0,
   "nModified" : 0,
   "nRemoved" : 0,
   "upserted" : [ ]
})
```

An example of usage:
```js

//Large amount of items
const items = [
  ...
];

//Fields to match on for upsert condition
const matchFields = ['foo', 'bar.nested'];

//Perform bulk operation
const result = await MyModel.bulkUpsertReplaceOne(items, matchFields);

//Returns promise with MongoDB bulk result object
console.log(result.nUpserted + result.nModified, 'items processed');
```

## Credits

* Original project was created by [Adam Reis](https://adam.reis.nz)

## License
(MIT License)
