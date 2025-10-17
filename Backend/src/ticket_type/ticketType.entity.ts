import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/mysql";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Ticket } from "../ticket/ticket.entity.js";

@Entity()
export class TicketType extends BaseEntity{
  @Property()
  description!: string;

  @ManyToOne({entity: () => Ticket})
  ticket?: Rel<Ticket>;
}