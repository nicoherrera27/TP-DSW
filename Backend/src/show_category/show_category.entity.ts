import { Collection, Entity, OneToMany, Property, Cascade } from "@mikro-orm/mysql";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Show } from "../show/show.entity.js";

@Entity()

export class ShowCategory extends BaseEntity {

  @Property()
  description!:string;

  @Property()
  price!:number;

  @OneToMany({entity: () => Show, mappedBy: 'showCat', cascade: [Cascade.ALL]} )
  shows = new Collection<Show>(this);

}