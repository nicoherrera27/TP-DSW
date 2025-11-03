import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Cascade, Collection, Rel } from "@mikro-orm/mysql";
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { User } from "../user/user.entity.js";
import { Ticket } from "../ticket/ticket.entity.js";

@Entity()
export class Sale extends BaseEntity{
    
  @Property({nullable: false})
  amount!: number

  @Property({nullable: false})
  total_price?: number

  @Property({nullable: false})
  dateTime!: Date

  @ManyToOne({entity: () => User})
  userSale?: Rel<User>
    
  @OneToMany({entity: () => Ticket, mappedBy: 'ticketSale', cascade: [Cascade.ALL]})
  tickets = new Collection<Ticket>(this)

  @Property({ nullable: true, unique: true }) // ID de pago de MP
  mpPaymentId?: string;

  @Property({ nullable: true, index: true }) // Referencia externa que enviaste a MP
  mpExternalReference?: string;
  
}