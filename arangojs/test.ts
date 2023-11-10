// TS: import { Database, aql } from "arangojs";
const { Database, aql } = require('arangojs')

const db = new Database({
  url: 'http://127.0.0.1:8529',
  auth: { username: 'root', password: 'thereisnospoon' },
})

// The credentials can be swapped at any time
//db.useBasicAuth('admin', 'maplesyrup')

async function main() {
  const testdb_name = 'testdb'
  const testcollection_name = 'testCollection'

  try {
    const res = await db.createDatabase(testdb_name)
    console.log('Database created:', res)
  } catch (err) {
    console.error('Database already exists, deleting and creating a new one...')
    await db.dropDatabase(testdb_name)
    await db.createDatabase(testdb_name)
  }

  const collection = db.collection(testcollection_name)

  try {
    const res = await collection.create()
    console.log('Collection created:', res)
  } catch (err) {
    console.error('Collection already exists')
  }

  const doc = { key: 'mykey', a: 'foo', b: 'bar', c: Date.now() }

  try {
    const meta = await collection.save(doc)
    console.log('Document saved:', meta._rev)
  } catch (err) {
    console.error('Failed to save document:', err)
  }

  try {
    const test_doc = await db.query(aql`
    FOR doc in ${collection}
    FILTER doc._key == "mykey"
    RETURN doc
    `)
    console.log('Document retrieved:', test_doc)
  } catch (err) {
    console.error('Failed to retrieve document:', err)
  }

  //try {
  //const pokemons = await db.query(aql`
  //FOR pokemon IN ${Pokemons}
  //FILTER pokemon.type == "fire"
  //RETURN pokemon
  //`)
  //console.log('My pokemons, let me show you them:')
  //for await (const pokemon of pokemons) {
  //console.log(pokemon.name)
  //}
  //} catch (err) {
  //console.error(err.message)
  //}
}
main()
