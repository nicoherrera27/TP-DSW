import { Entity, PrimaryKey, Property, OneToMany, Cascade, Collection, ManyToOne, Rel } from "@mikro-orm/mysql";
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Sale } from "../sale/sale.entity.js";
import { Show } from "../show/show.entity.js";
import { TicketType } from "../ticket_type/ticketType.entity.js";

@Entity()
export class Ticket extends BaseEntity{
    
    @Property({nullable: false, unique: true})
    type!: string

    @Property({nullable: false})
    row?: number

    @Property({nullable: false})
    column?: number

    @ManyToOne({entity: () => Sale})
    ticketSale!: Rel<Sale>

    @ManyToOne({entity: () => Show})
    showTicket!: Rel<Show>

    @OneToMany({entity: () => TicketType, mappedBy: 'ticket', cascade: [Cascade.ALL]})
    ticketTypes = new Collection<TicketType>(this)

}