import { MySqlDriver, MikroORM } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

export const orm = await MikroORM.init({
   entities: ['./dist/**/*.entity.js'],
   entitiesTs: ['./src/**/*.entity.ts'],
   
   // Se leen las variables de entorno para la configuración.
   dbName: process.env.DB_NAME,
   driver: MySqlDriver,
   host: process.env.DB_HOST,
   port: Number(process.env.DB_PORT),
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,

   highlighter: new SqlHighlighter(),
   debug: true,
   
   schemaGenerator:{
      disableForeignKeys: true,
      createForeignKeyConstraints: true,
      ignoreSchema:[],
   }
});

export const syncSchema = async () => {
   const generator = orm.getSchemaGenerator();
   /* await generator.dropSchema()
   await generator.createSchema()
   */
   await generator.updateSchema();
};