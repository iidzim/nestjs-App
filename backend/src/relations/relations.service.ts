import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getRepository } from "typeorm";
import { Player } from "../players/player.entity";
import { UsersService } from "../players/players.service";
import { GetRelationFilterDto } from "./dto-relation/get-relation-filter.dto";
import { Relation } from "./relation.entity";
import { RelationRepository } from "./relation.repository";
import { RelationStatus } from "./relation_status.enum";

@Injectable()
export class RelationsService {
	constructor(
		@InjectRepository(RelationRepository)
		private relationRepository: RelationRepository,
		private readonly usersService: UsersService,
	) {}

	async getRelations(FilterDto: GetRelationFilterDto):Promise<Relation[]> { 
		return this.relationRepository.getRelations(FilterDto);
	}

	async getUsersByStatus(user: Player, status: RelationStatus) : Promise<Player[]> {

		const friend_relations = await getRepository(Relation).find({ where: { sender: user, status: status } });
		var friends = new Array();
		for (var relation of friend_relations) {
			const player = await this.usersService.getUserById(relation.receiver);
			friends.push(player);
		}
		return friends;
	}

	async addFriend(user: Player, friend_id: number): Promise<Relation> {
		const friend = await this.usersService.getUserById(friend_id);
		return this.relationRepository.addFriend(user, friend);
	}

	async blockPlayer(user: Player, blocked_id: number): Promise<Relation> {
		const blocked = await this.usersService.getUserById(blocked_id);
		return this.relationRepository.blockPlayer(user, blocked);
	}

	async unblock(user: Player, blocked_id: number): Promise<void> {
		await this.relationRepository.delete({ sender: user, receiver: blocked_id, status: RelationStatus.BLOCKED });
		console.log('friend unblocked');
	}

	async removeFriend(user: Player, friend_id: number): Promise<void> {
		const friend = await this.usersService.getUserById(friend_id);
		await this.relationRepository.delete({ sender: user, receiver: friend_id, status: RelationStatus.FRIEND });
		await this.relationRepository.delete({ sender: friend, receiver: user.id, status: RelationStatus.FRIEND });
		console.log('friend removed');
	}

	async checkBlock(user_id: number, blocked_id: number): Promise<Relation> {
		const blocked = await this.usersService.getUserById(blocked_id);
		let user = await this.usersService.getUserById(user_id);
		return await this.relationRepository.checkBlock(user, blocked);
	}
}