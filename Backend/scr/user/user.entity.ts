import { 
  Entity,
  Property,
  OneToOne
} from "@mikro-orm/core";
import { BaseEntity } from "../zshare/db/baseEntity.entity.js";
import { Person } from "../person/person.entity.js";
@Entity()
export class User extends BaseEntity {
  @Property({nullable: false, unique:true })
  username!: string

  @Property({nullable: false, unique:true})
  password!: string

  @OneToOne(() => Person, (person) => person.user, { nullable: true, owner: true })
  person?: typeof Person;
  static create: any;

}