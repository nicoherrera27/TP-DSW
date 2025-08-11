import { Migration } from '@mikro-orm/migrations';

export class Migration20250810160338 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`movie\` (\`id\` int unsigned not null auto_increment primary key, \`name\` varchar(255) not null, \`duration\` int not null, \`synopsis\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`movie_room\` (\`id\` int unsigned not null auto_increment primary key, \`name\` varchar(255) not null, \`capacity\` int not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`movie_room\` add unique \`movie_room_name_unique\`(\`name\`);`);

    this.addSql(`create table \`seat\` (\`id\` int unsigned not null auto_increment primary key, \`row\` int not null, \`number\` int not null, \`seat_room_id\` int unsigned not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`seat\` add index \`seat_seat_room_id_index\`(\`seat_room_id\`);`);

    this.addSql(`create table \`show_category\` (\`id\` int unsigned not null auto_increment primary key, \`description\` varchar(255) not null, \`price\` int not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`show\` (\`id\` int unsigned not null auto_increment primary key, \`date\` varchar(255) not null, \`state\` varchar(255) not null, \`show_cat_id\` int unsigned not null, \`show_movie_id\` int unsigned not null, \`show_room_id\` int unsigned not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`show\` add index \`show_show_cat_id_index\`(\`show_cat_id\`);`);
    this.addSql(`alter table \`show\` add index \`show_show_movie_id_index\`(\`show_movie_id\`);`);
    this.addSql(`alter table \`show\` add index \`show_show_room_id_index\`(\`show_room_id\`);`);

    this.addSql(`create table \`user\` (\`id\` int unsigned not null auto_increment primary key, \`username\` varchar(255) not null, \`password\` varchar(255) not null, \`name\` varchar(255) not null, \`surname\` varchar(255) not null, \`email\` varchar(255) not null, \`birthdate\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`user\` add unique \`user_username_unique\`(\`username\`);`);
    this.addSql(`alter table \`user\` add unique \`user_email_unique\`(\`email\`);`);

    this.addSql(`create table \`sale\` (\`id\` int unsigned not null auto_increment primary key, \`amount\` int not null, \`total_price\` int not null, \`date_time\` datetime not null, \`user_sale_id\` int unsigned not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`sale\` add index \`sale_user_sale_id_index\`(\`user_sale_id\`);`);

    this.addSql(`create table \`ticket\` (\`id\` int unsigned not null auto_increment primary key, \`type\` varchar(255) not null, \`row\` int not null, \`column\` int not null, \`ticket_sale_id\` int unsigned not null, \`show_ticket_id\` int unsigned not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`ticket\` add unique \`ticket_type_unique\`(\`type\`);`);
    this.addSql(`alter table \`ticket\` add index \`ticket_ticket_sale_id_index\`(\`ticket_sale_id\`);`);
    this.addSql(`alter table \`ticket\` add index \`ticket_show_ticket_id_index\`(\`show_ticket_id\`);`);

    this.addSql(`alter table \`seat\` add constraint \`seat_seat_room_id_foreign\` foreign key (\`seat_room_id\`) references \`movie_room\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`show\` add constraint \`show_show_cat_id_foreign\` foreign key (\`show_cat_id\`) references \`show_category\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`show\` add constraint \`show_show_movie_id_foreign\` foreign key (\`show_movie_id\`) references \`movie\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`show\` add constraint \`show_show_room_id_foreign\` foreign key (\`show_room_id\`) references \`movie_room\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`sale\` add constraint \`sale_user_sale_id_foreign\` foreign key (\`user_sale_id\`) references \`user\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`ticket\` add constraint \`ticket_ticket_sale_id_foreign\` foreign key (\`ticket_sale_id\`) references \`sale\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`ticket\` add constraint \`ticket_show_ticket_id_foreign\` foreign key (\`show_ticket_id\`) references \`show\` (\`id\`) on update cascade;`);
  }

}
