import { Database } from 'arangojs'

export async function up(db: Database, db_name: string): Promise<Boolean> {
  try {
    // Create the database only if it doesn't exist already
    const db_names = await db.listDatabases()
    if (!db_names.includes(db_name)) {
      await db.createDatabase(db_name)
    }

    // Delete all colletions in the database
    const collections = await db.listCollections()
    for (const collection of collections) {
      console.log(`Dropping collection ${collection.name}`)
      await db.collection(collection.name).drop()
    }

    console.log(`Creating collection ${db_name}Entity`)
    await db.collection(`${db_name}Entity`).create()
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function down(db: Database): Promise<Boolean> {
  // Code to revert the migration...
  try {
    await db.collection('MetropolisEntity').drop()
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}
