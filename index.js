'use strict';
const S3fs = require('s3fs');
const Methods = require('./lib');

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
    const xfs = new S3fs(bucketPath, options.s3Options ? options.s3Options : {});
    const baseOptions = { xfs: xfs };

    return {
        /**
         * Store to S3
         * 
         * @param {Array | Object} filesToStore - File(s) to be stored.
         * @return {Function} - Exposes the Store method
         */
        store(filesToStore) {
            const storeOptions = Object.assign({}, baseOptions);
            storeOptions.files = Array.isArray(filesToStore) ? filesToStore : [filesToStore];
            return Methods.Store(storeOptions);
        },
        /**
         * Get from S3
         * 
         * @param {Object} options - Get options
         * @param {Array | String} options.filePath - File id(s) to be retrieved.
         * @return {Function} - Exposes the Get method
         */
        get(filePath) {
            const getOptions = Object.assign({}, baseOptions);
            getOptions.filePath = filePath;
            return Methods.Get(getOptions);
        },
        /**
         * Get All Files from S3
         * 
         * @param {String} directory - Specific directory to use within the bucket
         * @return {Function} - Exposes the getAll method
         */
        getAll(directory) {
            const getOptions = Object.assign({}, baseOptions);
            if (directory) {
                getOptions.directory = directory;
            }
            return Methods.GetAll(getOptions);
        },
        xfs: xfs
    };
};

module.exports = Connect;