import { Database } from 'arangojs'

export async function up(db: Database, db_name: string): Promise<Boolean> {
  // TODO?: Code to migrate up to version...
  return true
}

export async function down(db: Database): Promise<Boolean> {
  // TODO?: Code to revert the migration...
  return true
}
