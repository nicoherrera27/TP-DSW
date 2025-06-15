import { Entity, Property } from "@mikro-orm/mysql";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";

@Entity()

export class ShowCategory extends BaseEntity {

  @Property({nullable: false, unique: true})
  description!:string
  
}