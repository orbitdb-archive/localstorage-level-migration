'use strict'

const levelup = require('levelup')

module.exports = (level, LocalStorage, mkdir) => {
    return {
        migrateKeys: async (sourcePath, existingId, options = {}) => {
            if (!sourcePath) {
                throw new Error('path to keystore required')
            }
            if (!existingId) {
                throw new Error('key id required')
            }

            const target = options.targetPath ? options.targetPath : sourcePath

            if (mkdir && mkdir.sync){
                mkdir.sync(sourcePath)
                mkdir.sync(target)
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

            const levelStore = await open(target)
            await levelStore.put(targetId, JSON.stringify(key))

            const close = (store) => new Promise((resolve, reject) => {
                store.close((err) => {
                    if (err) {
                        reject(err)
                    }
                    store = null
                    resolve()
                })
            })
            await close(levelStore)
        }
    }
}
