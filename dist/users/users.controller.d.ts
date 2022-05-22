import { UsersService } from "./users.service";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    addUser(id: string, username: string, avatar: string): any;
    getAllUsers(): import("./users.model").User[];
    getUser(login: string): {
        [x: number]: number | import("./users.model").User;
        0: import("./users.model").User;
        1: number;
        length: 2;
        toString(): string;
        toLocaleString(): string;
        pop(): number | import("./users.model").User;
        push(...items: (number | import("./users.model").User)[]): number;
        concat(...items: ConcatArray<number | import("./users.model").User>[]): (number | import("./users.model").User)[];
        concat(...items: (number | import("./users.model").User | ConcatArray<number | import("./users.model").User>)[]): (number | import("./users.model").User)[];
        join(separator?: string): string;
        reverse(): (number | import("./users.model").User)[];
        shift(): number | import("./users.model").User;
        slice(start?: number, end?: number): (number | import("./users.model").User)[];
        sort(compareFn?: (a: number | import("./users.model").User, b: number | import("./users.model").User) => number): [import("./users.model").User, number];
        splice(start: number, deleteCount?: number): (number | import("./users.model").User)[];
        splice(start: number, deleteCount: number, ...items: (number | import("./users.model").User)[]): (number | import("./users.model").User)[];
        unshift(...items: (number | import("./users.model").User)[]): number;
        indexOf(searchElement: number | import("./users.model").User, fromIndex?: number): number;
        lastIndexOf(searchElement: number | import("./users.model").User, fromIndex?: number): number;
        every<S extends number | import("./users.model").User>(predicate: (value: number | import("./users.model").User, index: number, array: (number | import("./users.model").User)[]) => value is S, thisArg?: any): this is S[];
        every(predicate: (value: number | import("./users.model").User, index: number, array: (number | import("./users.model").User)[]) => unknown, thisArg?: any): boolean;
        some(predicate: (value: number | import("./users.model").User, index: number, array: (number | import("./users.model").User)[]) => unknown, thisArg?: any): boolean;
        forEach(callbackfn: (value: number | import("./users.model").User, index: number, array: (number | import("./users.model").User)[]) => void, thisArg?: any): void;
        map<U>(callbackfn: (value: number | import("./users.model").User, index: number, array: (number | import("./users.model").User)[]) => U, thisArg?: any): U[];
        filter<S_1 extends number | import("./users.model").User>(predicate: (value: number | import("./users.model").User, index: number, array: (number | import("./users.model").User)[]) => value is S_1, thisArg?: any): S_1[];
        filter(predicate: (value: number | import("./users.model").User, index: number, array: (number | import("./users.model").User)[]) => unknown, thisArg?: any): (number | import("./users.model").User)[];
        reduce(callbackfn: (previousValue: number | import("./users.model").User, currentValue: number | import("./users.model").User, currentIndex: number, array: (number | import("./users.model").User)[]) => number | import("./users.model").User): number | import("./users.model").User;
        reduce(callbackfn: (previousValue: number | import("./users.model").User, currentValue: number | import("./users.model").User, currentIndex: number, array: (number | import("./users.model").User)[]) => number | import("./users.model").User, initialValue: number | import("./users.model").User): number | import("./users.model").User;
        reduce<U_1>(callbackfn: (previousValue: U_1, currentValue: number | import("./users.model").User, currentIndex: number, array: (number | import("./users.model").User)[]) => U_1, initialValue: U_1): U_1;
        reduceRight(callbackfn: (previousValue: number | import("./users.model").User, currentValue: number | import("./users.model").User, currentIndex: number, array: (number | import("./users.model").User)[]) => number | import("./users.model").User): number | import("./users.model").User;
        reduceRight(callbackfn: (previousValue: number | import("./users.model").User, currentValue: number | import("./users.model").User, currentIndex: number, array: (number | import("./users.model").User)[]) => number | import("./users.model").User, initialValue: number | import("./users.model").User): number | import("./users.model").User;
        reduceRight<U_2>(callbackfn: (previousValue: U_2, currentValue: number | import("./users.model").User, currentIndex: number, array: (number | import("./users.model").User)[]) => U_2, initialValue: U_2): U_2;
        find<S_2 extends number | import("./users.model").User>(predicate: (this: void, value: number | import("./users.model").User, index: number, obj: (number | import("./users.model").User)[]) => value is S_2, thisArg?: any): S_2;
        find(predicate: (value: number | import("./users.model").User, index: number, obj: (number | import("./users.model").User)[]) => unknown, thisArg?: any): number | import("./users.model").User;
        findIndex(predicate: (value: number | import("./users.model").User, index: number, obj: (number | import("./users.model").User)[]) => unknown, thisArg?: any): number;
        fill(value: number | import("./users.model").User, start?: number, end?: number): [import("./users.model").User, number];
        copyWithin(target: number, start: number, end?: number): [import("./users.model").User, number];
        entries(): IterableIterator<[number, number | import("./users.model").User]>;
        keys(): IterableIterator<number>;
        values(): IterableIterator<number | import("./users.model").User>;
        includes(searchElement: number | import("./users.model").User, fromIndex?: number): boolean;
        flatMap<U_3, This = undefined>(callback: (this: This, value: number | import("./users.model").User, index: number, array: (number | import("./users.model").User)[]) => U_3 | readonly U_3[], thisArg?: This): U_3[];
        flat<A, D extends number = 1>(this: A, depth?: D): FlatArray<A, D>[];
        [Symbol.iterator](): IterableIterator<number | import("./users.model").User>;
        [Symbol.unscopables](): {
            copyWithin: boolean;
            entries: boolean;
            fill: boolean;
            find: boolean;
            findIndex: boolean;
            keys: boolean;
            values: boolean;
        };
        at(index: number): number | import("./users.model").User;
    };
    updateUsername(id: string, username: string): any;
    updateAvatar(id: string, avatar: string): any;
}
