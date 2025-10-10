import { Collection, Entity, OneToMany, Property, Cascade } from "@mikro-orm/mysql";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Sale } from "../sale/sale.entity.js";

@Entity()

export class User extends BaseEntity {

  @Property({nullable: false, unique: true})
  username!:string

  @Property({nullable: false})
  password!:string

  @Property({nullable: false})
  name!:string

  @Property({nullable: false})
  surname!:string

  @Property({nullable: false, unique: true})
  email!:string

  @Property({type: 'date', nullable: false})
  birthdate!: Date

  @OneToMany({entity: () => Sale, mappedBy: 'userSale', cascade: [Cascade.ALL]} )
  sales = new Collection<Sale>(this)
}