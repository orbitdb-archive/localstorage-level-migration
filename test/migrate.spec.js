import assert from 'assert'
import migrate from '../src/index-nodejs.js'
import path from 'path'
import Keystore from 'orbit-db-keystore'
import rmrf from 'rimraf'

describe('LocalStorage Level Migration', () => {
  it('migrates to target store', async () => {
    const fixturesPath = path.resolve('./test/fixtures/keys')
    const keyStorePath = fixturesPath + 'keystore'
    const source = fixturesPath + '/existing.json'

    const keystore = new Keystore(keyStorePath)
    await keystore.open()

    migrate(source)({ targetStore: keystore._store })

    const key = await keystore.getKey('existing.json')

    assert.strictEqual(Buffer.from(key.public.marshal()).toString('hex'), '035756c20f03ec494d07e8dd8456f67d6bd97ca175e6c4882435fe364392f13140')

    await keystore.close()
    rmrf.sync(keyStorePath)
  })
})
