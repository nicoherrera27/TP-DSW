import { MikroORM } from "@mikro-orm/core";
import { MySqlDriver } from "@mikro-orm/mysql";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";

export const orm = await MikroORM.init({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName:  'cine_test',
    driver: MySqlDriver,
    clientUrl: 'mysql:/root:agusBattlefront2@1864@localhost:3306/cine_test',
    highlighter: new SqlHighlighter(),
    debug: true,

    schemaGenerator: { //solo para desarrollar esto, nunca usar en la produccion
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
        ignoreSchema: [],
    },
})

export const syncSchema = async () => {
    const generator = orm.getSchemaGenerator()
    /*
    await generator.dropSchema()
    await generator.createSchema()
    */
    await generator.updateSchema()
}