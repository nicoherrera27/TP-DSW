import { Entity, PrimaryKey, Property, OneToMany, Cascade, Collection } from "@mikro-orm/mysql";
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class Ticket extends BaseEntity{
    
    @Property({nullable: false, unique: true})
    type!: string

    @Property({nullable: false})
    row?: number

    @Property({nullable: false})
    column?: number


    //OneToMany con show y ManyToOne con sale
}