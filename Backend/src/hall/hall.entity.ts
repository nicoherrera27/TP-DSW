import { Entity, PrimaryKey, Property, OneToMany, Cascade, Collection } from "@mikro-orm/core";
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class Hall extends BaseEntity{
    
    @Property({nullable: false, unique: true})
    number!: number

    @Property({nullable: false})
    capacity!: number
}