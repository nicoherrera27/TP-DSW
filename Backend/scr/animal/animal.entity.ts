import { Entity, ManyToOne, PrimaryKey, Property, Cascade, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../zshare/db/baseEntity.entity.js";
import { BreedClass } from "../breed/breed.entity.js";
@Entity()
export class Animal extends BaseEntity {
  [x: string]: any;

  @ManyToOne(() => BreedClass, {nullable: false})
  breedClass!: Rel<BreedClass>

  @Property({nullable: false, unique: true})
  name!: string

  @Property()
  rescue_date!: Date

  @Property()
  birth_date!: Date



}