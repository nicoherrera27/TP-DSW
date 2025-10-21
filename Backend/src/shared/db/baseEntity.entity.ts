import { PrimaryKey, Property } from "@mikro-orm/mysql"

export abstract class BaseEntity {
  @PrimaryKey()
  id!: number

 // @Property()
 // createdAt: Date = new Date()

 // @Property({ onUpdate: () => new Date() })
 // updatedAt: Date = new Date()
}
