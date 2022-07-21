import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn, Unique,  } from "typeorm";
import { UserStatus } from "./player_status.enum";
// import { Game } from "../games/game.entity";
import { Relation } from "../relations/relation.entity";
import { Exclude } from "class-transformer";
import { membership } from "src/chat/membership.entity";
import { message } from "src/chat/message.entity";

@Entity('player')
@Unique(['username'])
export class Player extends BaseEntity {

	@PrimaryColumn()
	id: number;

	@Column()
	username: string;

	@Column()
	avatar: string;

	// @Column({type: 'real'})
	@Column()
	level: number;

	@Column()
	wins: number;

	@Column()
	losses: number;

	@Column({ default: UserStatus.ONLINE})
	status: UserStatus;

	@Column({ nullable: true}) //= drop DB - column: nullable-> false -
	email: string;

	@Column({ default: false })
	two_fa: boolean;

	// @OneToMany(
	// 	type => Relation,
	// 	relation => relation.receiver,
	// 	{ eager: true })
	// receivers: Relation[];
	@Column({ nullable: true })
	secret: string;

	@OneToMany(
		type => Relation,
		relation => relation.sender,
		{eager: true}
	)
	senders: Relation[];

	@OneToMany(()=> membership, membership=>membership.Player)
    memberships : membership[];

    @OneToMany(()=>message, message=> message.Player)
    messages:message[];
}