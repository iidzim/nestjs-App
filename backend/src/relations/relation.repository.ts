import { BadRequestException, forwardRef, Inject } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { Player } from "../players/player.entity";
import { GetRelationFilterDto } from "./dto-relation/get-relation-filter.dto";
import { Relation } from "./relation.entity";
import { RelationStatus } from "./relation_status.enum";

@EntityRepository(Relation)
export class RelationRepository extends Repository<Relation> {
	constructor(
		// @Inject(forwardRef( () => UsersService))
	) { super() }

	async getRelations(FilterDto: GetRelationFilterDto): Promise<Relation[]> {
		const { id, status } = FilterDto;
		const query = this.createQueryBuilder('relation');
		if (id) {
			query.andWhere('relation.id = :id', { id });
		}
		if (status) {
			query.andWhere('relation.status = :status', { status });
		}
		const relations = await query.getMany();
		return relations;
	}

	// async addFriend(user: Player, friend_id: number): Promise<Relation> {
	async addFriend(user: Player, friend: Player): Promise<Relation> {

		// const exist = await this.findOne({ where: { sender: user, receiver: friend.id, status: RelationStatus.FRIEND } });
		// if (exist) {
		// 	console.log('already friend');
		// 	return exist;
		// }
		//td: check if the user is not blocked -> add friend
		const blocked = await this.findOne({ where: { sender: user, receiver: friend.id, status: RelationStatus.BLOCKED } });
		const blocked2 = await this.findOne({ where: { sender: friend, receiver: user.id, status: RelationStatus.BLOCKED } });
		if (blocked || blocked2) {
			console.log('user is blocked !!!!!!!!!!!!');
			throw new BadRequestException('You cannot add this user, user is blocked');
		}
		const relation_user = new Relation();
		relation_user.receiver = friend.id;
		relation_user.sender = user;
		relation_user.status = RelationStatus.FRIEND;
		await relation_user.save();
		const relation_friend = new Relation();
		relation_friend.receiver = user.id;
		relation_friend.sender = friend;
		relation_friend.status = RelationStatus.FRIEND;
		await relation_friend.save();
		console.log('friend added suuccessfully');
		return relation_user;
	}

	async blockPlayer(user: Player, blocked_id: number): Promise<Relation> {

		//td: check if the user is a friend -> remove from friend list
		const friend = await this.findOne({ where: { sender: user, receiver: blocked_id, status: RelationStatus.FRIEND } });
		if (friend) {
			friend.status = RelationStatus.BLOCKED;
			await friend.save();
			return friend;
		}
		// const relation = new Relation();
		// // relation.receiver = await this.userService.getUserById(recv_id);
		// relation.receiver = blocked_id;
		// relation.sender = user;
		// relation.status = RelationStatus.BLOCKED;
		// await relation.save();
		// console.log('friend blocked suuccessfully');
		// return relation; //= cannot block user who is not your friend
	}
}