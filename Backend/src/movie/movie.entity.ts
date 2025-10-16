import { Cascade, Collection, Entity, OneToMany, Property } from "@mikro-orm/mysql";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Show } from "../show/show.entity.js";

@Entity()

export class Movie extends BaseEntity{

  @Property({unique: true, nullable: true})
  tmdbId!: number;

  @Property()
  name!: string;

  @Property()
  duration!: number;

  @Property({type: 'text'})
  synopsis?: string;

  @Property()
  genre!:string;

  @Property()
  url!: string;

  @OneToMany({entity: () => Show, mappedBy: 'showMovie', cascade: [Cascade.ALL]})
  shows = new Collection<Show>(this);


}