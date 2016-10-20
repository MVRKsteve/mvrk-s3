'use strict';
const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const Promise = require('bluebird');
const StoreToS3 = require('../index');
const utils = require('./utils');

require('node-env-file')(__dirname + '/.env');
const defaultOptions = {
    directory: process.env.BUCKET_DIRECTORY,
    s3Options: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
        failOnBucketNotExist: true
    }
};

describe('When Storing Files to S3 it should', () => {

    describe('Attempt to setup without a non-existent bucket', () => {
        defaultOptions.bucket = 'non-existent-bucket';
        const db = StoreToS3(defaultOptions);

        it('and it should fail to store a Statement', () => {
            const file = utils.buildFile('failFile');
            return expect(db.store(file)).to.eventually.be.rejected;
        });
    });

    describe('Setup an existing bucket and', () => {
        defaultOptions.bucket = process.env.BUCKET_NAME;
        const db = StoreToS3(defaultOptions);
        const xfs = db.xfs;
        const Store = db.store;
        const Get = db.get;
        const GetAll = db.getAll;
        var storedTags = [];

        after(() => {
            return xfs.rmdirp('/').then(() => {
                console.log('\n\nDirectory Successfully Deleted on S3!'); // eslint-disable-line no-console
                return;
            })
            .catch(err => {
                console.log(`\n\nDirectory Was Not Deleted because \n ${JSON.stringify(err, null, 2)}`); // eslint-disable-line no-console
                return;
            });
        });

        it('Store a single file and Get it back', () => {
            const fileName = 'singleFile.png';
            const file = utils.buildFile(fileName);
            var etag;
            return Store(file).then(fileETags => {
                etag = fileETags[0];
                storedTags.push(etag);
                expect(fileETags).to.be.an('array');
                return expect(fileETags.length).to.eql(1);
            })
            .then(() => {
                return Get(fileName);
            })
            .then(found => {
                return expect(found.ETag).to.deep.eql(etag);
            });
        });
        
        it('Store multiple files and Get them back', () => {
            const fileName1 = 'multiFile1.png';
            const fileName2 = 'multiFile2.png';
            const files = [utils.buildFile(fileName1), utils.buildFile(fileName2)];
            var etags;
            return Store(files).then(fileETags => {
                etags = fileETags;
                storedTags = storedTags.concat(etags);
                expect(fileETags).to.be.an('array');
                return expect(fileETags.length).to.eql(2);
            })
            .then(() => {
                return Promise.all(files.map(file => Get(file.name)));
            })
            .spread((first, second) => {
                return expect([first.ETag, second.ETag]).to.deep.eql(etags);
            });
        });

        it('Get All available files in the bucket', () => {
            return GetAll().then(files => {
                return expect(files.map(file => file.ETag)).to.deep.eql(storedTags);
            });
        });
    });
});