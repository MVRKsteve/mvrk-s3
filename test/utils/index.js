'use strict';
const fs = require('fs');
const path = require('path');

module.exports = {
    buildFile(name) {
        return {
            name: name,
            value: fs.createReadStream(path.resolve(__dirname, 'Future.png'))
        };
    }
};