import { Collection, Entity, OneToMany, Property, Cascade } from "@mikro-orm/mysql";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Ticket } from "../ticket/ticket.entity.js";

@Entity()
export class TicketType extends BaseEntity{
  @Property()
  description!: string;

  @Property({ type: 'decimal', precision: 3, scale: 2 })
  bonification!: number;

  @OneToMany({ entity: () => Ticket, mappedBy: 'ticketType', cascade: [Cascade.ALL] })
  tickets = new Collection<Ticket>(this);
}