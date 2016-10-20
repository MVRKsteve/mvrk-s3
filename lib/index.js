'use strict';
const Promise = require('bluebird');

/**
 * Store Files to S3
 *
 * @param {Object} options - Options for storing files to S3
 * @param {Array} options.files - File Object(s) to be stored.
 * @param {Object} options.xfs - S3FS Implementation
 * @return { Promise.resolve<Files[]> } - Array of stored file names.
 * @return { Promise.reject<Error> } - Error describing the issue with storage.
 */
const storeToS3 = (options) => {
    return Promise.all(options.files.map(file => options.xfs.writeFile(`${file.name}`, file.value)))
        .map(file => file.ETag);
};

/**
 * Get from S3
 * 
 * @param {Object} options - Get options
 * @param {Array | String} options.filePath - File path to be retrieved.
 * @param {Object} options.xfs - S3FS instance
 * @return {File} - Returns the file from S3
 */
const getFromS3 = (options) => {
    if (!options.filePath) {
        return new Error('Please provide a file path');
    }
    return options.xfs.readFile(options.filePath, 'utf8');
};

/**
 * Get All from S3
 * 
 * @param {Object} options - Get options
 * @param {String} options.directory - Directory to be read
 * @param {Object} options.xfs - S3FS instance
 * @return {File(s)} - Returns the file(s) from S3
 */
const getAllFromS3 = (options) => {
    const xfs = options.xfs;
    const directory = options.directory ? `${options.directory}/` : '/';
    return xfs.readdirp(directory).then(files => {
        return Promise.map(files, file => {
            options.filePath = `${directory}${file}`;
            return getFromS3(options);
        });
    });
};

module.exports = {
    Store: storeToS3,
    Get: getFromS3,
    GetAll: getAllFromS3
};