import { Database } from 'arangojs'
import * as fs from 'fs'
import * as path from 'path'

export async function migrate(db: Database) {
  const migrationFiles = fs.readdirSync(path.join(__dirname, 'arangodb-migrations')).sort()

  for (const file of migrationFiles) {
    const migration = await import(path.join(__dirname, 'arangodb-migrations', file))
    await migration.up(db)
  }
}
