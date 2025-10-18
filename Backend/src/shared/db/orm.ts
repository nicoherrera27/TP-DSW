import { MySqlDriver, MikroORM } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';


// No es necesario importar dotenv aquí, ya que app.ts lo carga globalmente.

export const orm = await MikroORM.init({
   entities: ['./dist/**/*.entity.js'],
   entitiesTs: ['./src/**/*.entity.ts'],
   
   // CORRECCIÓN: Se leen las variables de entorno para la configuración.
   dbName: process.env.DB_NAME,
   driver: MySqlDriver,
   host: process.env.DB_HOST,
   port: Number(process.env.DB_PORT), // Se convierte a número
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,

   // La propiedad 'clientUrl' ya no es necesaria y se elimina.

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