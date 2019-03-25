const mkdirp = require('mkdirp')
const LocalStorage = require('node-localstorage').LocalStorage
const Migrate = require('./src/migrate')
const level = require('leveldown')
module.exports = Migrate(level, LocalStorage, mkdirp)
