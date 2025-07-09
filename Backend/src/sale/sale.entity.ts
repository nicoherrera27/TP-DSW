import { Entity, PrimaryKey, Property, OneToMany, Cascade, Collection } from "@mikro-orm/mysql";
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class Sale extends BaseEntity{
    
    @Property({nullable: false})
    amount!: number

    @Property({nullable: false})
    total_price?: number

    @Property({nullable: false})
    dateTime!: Date


    //OnetoMany con ticket y ManytoOne con user
}