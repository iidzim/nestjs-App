import { BaseEntity } from "typeorm";
import { UserStatus } from "./player_status.enum";
import { Relation } from "../relations/relation.entity";
import { membership } from "src/chat/membership.entity";
import { message } from "src/chat/message.entity";
export declare class Player extends BaseEntity {
    id: number;
    username: string;
    avatar: string;
    level: number;
    wins: number;
    losses: number;
    status: UserStatus;
    email: string;
    two_fa: boolean;
    secret: string;
    senders: Relation[];
    memberships: membership[];
    messages: message[];
}
