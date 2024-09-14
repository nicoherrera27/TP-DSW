import { 
  Entity,
  Property,
  Collection,
  ManyToMany,
  Cascade
} from "@mikro-orm/core";
import { BaseEntity } from "../zshare/db/baseEntity.entity.js";
import { Rescue } from "../rescue/rescue.entity.js";
@Entity()
export class Shelter extends BaseEntity {
  [x: string]: any;
  @Property({nullable: false, unique: true})
  name!: string

  @Property()
  address!: string

  @Property()
  max_capacity!: number

  @ManyToMany(() => Rescue, (rescue) => rescue.shelters, {  owner: true, nullable: true,   cascade: [Cascade.ALL] }, )
  rescues = new Collection<Rescue>(this)
}
