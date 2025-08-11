
import { MySqlDriver} from '@mikro-orm/mysql'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { MikroORM } from '@mikro-orm/core'

export const orm = await MikroORM.init({
   entities: ['./dist/**/*.entity.js'],
   entitiesTs: ['./src/**/*.entity.ts'],
   dbName: 'cine_test',
   driver: MySqlDriver,
   clientUrl: 'mysql://root:1864@localhost:3306/cine_test',
   //netadataProvider: TsMorphMetadataProvider,
   highlighter: new SqlHighlighter(),
   debug: true,
   
   schemaGenerator:{ // no se debe utilizar en produccion
      disableForeignKeys: true,
      createForeignKeyConstraints: true,
      ignoreSchema:[],
   }
})

export const syncSchema = async () => {
   const generator = orm.getSchemaGenerator()
   /*   
   await generator.dropSchema()
   await generator.createSchema()
   */
   await generator.updateSchema()
 }
