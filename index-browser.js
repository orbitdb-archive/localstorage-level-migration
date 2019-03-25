const level = require('level-js')
const Migrate = require('./src/migrate')
module.exports = Migrate(level)
