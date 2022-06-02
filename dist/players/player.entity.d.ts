import { BaseEntity } from "typeorm";
import { UserStatus } from "./player_status.enum";
import { Relation } from "../relations/relation.entity";
export declare class Player extends BaseEntity {
    id: number;
    username: string;
    avatar: string;
    level: number;
    status: UserStatus;
    password: string;
    salt: string;
    relations: Relation[];
    validatePassword(password: string): Promise<Boolean>;
}
