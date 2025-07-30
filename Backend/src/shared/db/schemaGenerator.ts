import { MikroORM } from "@mikro-orm/mysql"
import config from "../../mikro-orm.config.js"

export const orm = await MikroORM.init(config)

export const syncSchema = async () => { // en produccion se saca
   const generator = orm.getSchemaGenerator()
   /*   
   await generator.dropSchema()
   await generator.createSchema()
   */
   await generator.updateSchema()
}
