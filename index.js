'use strict';
const S3fs = require('s3fs');
const Methods = require('./lib');
var xfs;


/**
 * Store to S3
 * 
 * @param {Array | Object} filesToStore - File(s) to be stored.
 * @return {Function} - Exposes the Store method
 */
const Store = (filesToStore) => {
    const storeOptions = {
        files: Array.isArray(filesToStore) ? filesToStore : [filesToStore],
        xfs: xfs
    };
    return Methods.Store(storeOptions);
};

/**
 * Get All Files from S3
 * 
 * @param {String} directory - Specific directory to use within the bucket
 * @return {Function} - Exposes the getAll method
 */
const getAll = (directory) => {
    const getOptions = { xfs: xfs };
    if (directory) {
        getOptions.directory = directory;
    }
    return Methods.GetAll(getOptions);
};

/**
 * Get from S3
 * 
 * @param {Object} options - Get options
 * @param {Array | String} options.filePath - File id(s) to be retrieved.
 * @return {Function} - Exposes the Get method
 */
const Get = (filePath) => {
    const getOptions = {
        xfs: xfs,
        filePath: filePath
    };
    return Methods.Get(getOptions);
};

/**
 * Initiate Connection to AWS S3
 * 
 * @param {Object} options - Setup options
 * @param {String} options.bucket - Name of bucket to be created/utilized **Required**
 * @param {String} options.directory - Specific directory to use within the bucket
 * @param {Object} options.s3Options - S3 options object
 * @return {Object} - Exposes available methods
 */
const Connect = (options) => {
    // Setup S3 Bucket and S3FS
    const withDirectory = options.directory ? `/${options.directory.replace(/ /g, '-')}` : '';
    const bucketPath = `${options.bucket}${withDirectory}`;
    xfs = new S3fs(bucketPath, options.s3Options ? options.s3Options : {});

    return {
        Store: Store,
        Get: Get,
        getAll: getAll,
        Create: xfs.create
    };
};

module.exports = Connect;