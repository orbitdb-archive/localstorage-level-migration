import mkdirp from 'mkdirp'
import { LocalStorage } from 'node-localstorage'
import Migrate from './migrate.js'
import level from 'leveldown'

export default Migrate(level, LocalStorage, mkdirp)
