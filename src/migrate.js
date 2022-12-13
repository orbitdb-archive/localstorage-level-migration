import levelup from 'levelup'

const migrate = (source, level, LocalStorage, mkdir) => async (options = {}) => {
  if (!source) {
    throw new Error('path to keys required')
  }
  const len = source.split('/').length
  const existingId = source.split('/')[len - 1]
  const sourcePath = source.split('/').splice(0, len - 1).join('/')
  if (!existingId) {
    throw new Error('key id required')
  }

  if (mkdir && mkdir.sync) {
    mkdir.sync(sourcePath)
  }

  const storage = LocalStorage ? new LocalStorage(sourcePath) : localStorage
  const keys = JSON.parse(storage.getItem(existingId))
  if (!keys) {
    throw new Error(`No keys with id ${existingId} found`)
  }

  const key = {
    publicKey: keys.publicKey,
    privateKey: keys.privateKey
  }

  const open = (dir) => new Promise((resolve, reject) => {
    const store = levelup(level(dir))
    store.open((err) => {
      if (err) {
        reject(err)
      }
      resolve(store)
    })
  })

  const targetId = options.targetId ? options.targetId : existingId

  const levelStore = options.targetStore
  await levelStore.put(targetId, JSON.stringify(key))
}

export default (level, LocalStorage, mkdir) => source => migrate(source, level, LocalStorage, mkdir)
