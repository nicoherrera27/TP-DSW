
import { MySqlDriver, defineConfig } from '@mikro-orm/mysql'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { SeedManager } from '@mikro-orm/seeder'


export default defineConfig({
   entities: ['./dist/**/*.entity.js'],
   entitiesTs: ['./src/**/*.entity.ts'],
   dbName: 'cine_test',
   driver: MySqlDriver,
   clientUrl: 'mysql://root:2719@localhost:3306/cine_test',
   //netadataProvider: TsMorphMetadataProvider,
   highlighter: new SqlHighlighter(),
   debug: true,
   extensions: [SeedManager], // enable seeding

   seeder: {
      path: './dist/shared/seeders', // path to the folder with seeders
      pathTs: './src/shared/seeders', // path to the folder with TS seeders (if used, you should put path to compiled files in `path`)
      defaultSeeder: 'TestSeeder', // default seeder class name
      glob: '!(*.d).{js,ts}', // how to match seeder files (all .js and .ts files, but not .d.ts)
      emit: 'ts', // seeder generation mode
      fileName: (className: string) => className, // seeder file naming convention
    },
   
   schemaGenerator:{
      disableForeignKeys: true,
      createForeignKeyConstraints: true,
      ignoreSchema:[],
   }
})

