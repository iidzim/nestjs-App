import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/croodles';
import * as bcrypt from 'bcrypt';
import { Player } from "./player.entity";
import { UserStatus } from "./player_status.enum";
import { EntityRepository, Repository } from "typeorm";
import { CreateUserDto } from "./dto-players/create-player.dto";
import { GetPlayersFilterDto } from "./dto-players/get-player-filter.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(Player)
export class PlayerRepository extends Repository<Player> {

	async getUsers(FilterDto: GetPlayersFilterDto): Promise<Player[]> {
		const { id, username, level, status } = FilterDto;
		const query = this.createQueryBuilder('user');
		if (id) {
			query.andWhere('user.id = :id', { id }) // or {status : 'ONLINE' } for a static result
		}
		if (username) {
			query.andWhere('user.username = :username', { username })
		}
		if (level) {
			query.andWhere('user.level == :level', { level })
		}
		if (status) {
			query.andWhere('user.status = :status', { status })
		}
		const users = await query.getMany();
		return users;
	}

	async signUp(createUserDto: CreateUserDto): Promise<void> {
		const { username, avatar, password } = createUserDto;
		const user = new Player();
		user.username = username;
		if (avatar) {
			user.avatar = avatar;
		} else {
			console.log('generate random avatar ^^')
			user.avatar = createAvatar(style, {seed: username + '.svg'});
		}
		user.salt = await bcrypt.genSalt();
		user.password = await this.hashPassword(password, user.salt);
		user.level = 0;
		user.status = UserStatus.OFFLINE;
		try {
			await user.save();
		} catch (error) {
			console.log(error.code);
			if (error.code === '23505') {
				throw new ConflictException('Username already exists');
			} else {
				console.log('HERE!');
				throw new InternalServerErrorException();
			}
		}
		console.log('HERE !!');
	}

	async validateUserPassword(createUserDto: CreateUserDto): Promise<string> {
		const { username, password } = createUserDto;
		const user = await this.findOne({ username });
		if (user && await user.validatePassword(password)) {
			return user.username;
		} else {
			return null;
		}
	}

	private async hashPassword(password: string, salt: string): Promise<string> {
		return bcrypt.hash(password, salt);
	}
}