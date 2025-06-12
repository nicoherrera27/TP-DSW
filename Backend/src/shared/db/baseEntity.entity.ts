import { PrimaryKey, Property, DateTimeType } from "@mikro-orm/core";

export abstract class HallClass{
    @PrimaryKey()   
    id?: string

    /*

    @Property({ type: DateTimeType })
    createdAt? = new Date()

    @Property({
        type: DateTimeType,
        onUpdate: () => new Date(),
        })
        
    updatedAt? new Date()

    */
}