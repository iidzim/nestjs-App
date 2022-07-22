"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneVOneService = void 0;
const common_1 = require("@nestjs/common");
const players_service_1 = require("../players/players.service");
const player_status_enum_1 = require("../players/player_status.enum");
const interfaces_1 = require("./interfaces");
const pong_game_service_1 = require("./pong-game.service");
const utils_1 = require("./utils");
let OneVOneService = class OneVOneService {
    constructor(pongGameService, usersService) {
        this.pongGameService = pongGameService;
        this.usersService = usersService;
        this.logger = new common_1.Logger('OneVOne PongGame Service: ');
        this.emptyPlayground = new utils_1.PlayGround(0, 0, 1000, 600, 'black', 9, false, '', '');
    }
    handleGetBackGround(playground) {
        return playground.getPlayGroundInterface();
    }
    handleUserConnected(client, players, wss) {
        if (client.handshake.query.role === 'player') {
            this.handlePlayerConnected(client, players, wss);
        }
        else if (client.handshake.query.role === 'spectator') {
            this.logger.log('spectator Connected: ' + client.id + ', roomname: ' + client.handshake.query.roomname);
            this.handleSpectatorConnected(client);
        }
    }
    async handleSpectatorConnected(client) {
        const { gamesRooms } = await this.pongGameService.getRooms();
        const roomname = client.handshake.query.roomname;
        const found = gamesRooms.find(room => room.roomname == roomname);
        if (found) {
            client.join(roomname);
        }
        else {
            client.emit('roomnotfound', {
                message: 'No such a Room',
            });
        }
    }
    async handlePlayerConnected(client, players, wss) {
        const user = await this.usersService.verifyToken(client.handshake.query.accessToken);
        client.data.user = user;
        const found = await this.usersService.findPlayer(user.id);
        if (found && found.status === player_status_enum_1.UserStatus.PLAYING) {
            client.emit('alreadyInGame', {
                player: user.username,
                message: 'You Are Already in a Game',
            });
        }
        else {
            const first = players.find(player => player.handshake.query.opponent === client.data.user.username
                && player.data.user.username === client.handshake.query.opponent);
            if (!first) {
                players.push(client);
                await this.usersService.updateStatus(user.id, player_status_enum_1.UserStatus.PLAYING);
                client.data.side = 'left';
                client.data.role = 'player';
                client.emit('WaitingForPlayer', {
                    player: user.username,
                    message: 'Waiting For Second Player',
                    playground: this.emptyPlayground.getPlayGroundInterface(),
                });
            }
            else {
                players = players.filter(player => player != first);
                client.data.side = 'right';
                client.data.role = 'player';
                const second = client;
                this.joinPlayersToGame(first, second, wss);
            }
        }
    }
    joinPlayersToGame(first, second, wss) {
        const roomname = first.id + '+' + second.id;
        first.join(roomname);
        second.join(roomname);
        first.data.roomname = roomname;
        second.data.roomname = roomname;
        first.data.opponentId = second.data.user.id;
        second.data.opponentId = first.data.user.id;
        this.pongGameService.addRoom({
            roomname, difficulty: interfaces_1.GameMood.ONEVONE, player1: first.data.user.username,
            player2: second.data.user.username
        });
        const playground = new utils_1.PlayGround(0, 0, 1000, 600, 'black', 9, false, first.data.user.username, second.data.user.username);
        first.data.playground = playground;
        second.data.playground = playground;
        this.logger.log('Starting Game in Room: ' + roomname + ' between: ' + first.data.user.username + ' & ' + second.data.user.username);
        const timer = setInterval(() => {
            if (playground.update() == false) {
                const pgi = this.handleGetBackGround(playground);
                wss
                    .to(roomname)
                    .emit('updatePlayground', { name: roomname, playground: pgi });
            }
            else {
                this.gameFinished(first, second, playground, wss);
            }
        }, (1.0 / 60) * 1000);
        first.data.gameInterval = timer;
        second.data.gameInterval = timer;
    }
    async gameFinished(first, second, playground, wss) {
        clearInterval(first.data.gameInterval);
        this.logger.log('Game in Room: ' + first.data.roomname + ' between: ', first.data.user.username + ' & ' + second.data.user.username + ' Finished');
        if (playground.scoreBoard.playerOneScore > playground.scoreBoard.playerTwoScore) {
            this.usersService.updateLevel(first.data.user.id, false);
            this.usersService.winsGame(first.data.user.id);
            this.usersService.LostGame(second.data.user.id);
            this.pongGameService.addGameHistory({
                mode: interfaces_1.GameMood.ONEVONE,
                winner: first.data.user,
                loser: second.data.user,
                winnerScore: playground.scoreBoard.playerOneScore,
                loserScore: playground.scoreBoard.playerTwoScore
            });
            wss.to(first.data.roomname).emit('DisplayWinner', { winner: first.data.user.username, loser: second.data.user.username });
        }
        else {
            this.usersService.updateLevel(second.data.user.id, false);
            this.usersService.winsGame(second.data.user.id);
            this.usersService.LostGame(first.data.user.id);
            this.pongGameService.addGameHistory({
                mode: interfaces_1.GameMood.ONEVONE,
                winner: second.data.user,
                loser: first.data.user,
                winnerScore: playground.scoreBoard.playerTwoScore,
                loserScore: playground.scoreBoard.playerOneScore
            });
            wss.to(first.data.roomname).emit('DisplayWinner', { winner: first.data.user.username, loser: second.data.user.username });
        }
        this.pongGameService.deleteRoom(first.data.roomname);
    }
    async handleUserDisconnected(wss, client) {
        if (client.handshake.query.role === 'player' && client.data.gameInterval) {
            if (client.data.gameInterval._destroyed === false) {
                client.data.playground.ball.reset(client.data.playground.width / 2, client.data.playground.height / 2);
                client.data.playground.leftPaddle.reset();
                client.data.playground.rightPaddle.reset();
                wss.to(client.data.roomname).emit('gameInterrupted', {
                    playground: this.handleGetBackGround(client.data.playground),
                });
                clearInterval(client.data.gameInterval);
                this.logger.log('Game Interval Cleared');
                await this.usersService.updateLevel(client.data.opponentId, false);
                await this.usersService.winsGame(client.data.opponentId);
                await this.usersService.LostGame(client.data.user.id);
                const second = await this.usersService.findPlayer(client.data.opponentId);
                if (second) {
                    this.pongGameService.addGameHistory({
                        mode: interfaces_1.GameMood.ONEVONE,
                        winner: await second,
                        loser: client.data.user,
                        winnerScore: client.data.playground.win_score,
                        loserScore: client.handshake.query.side === 'left' && client.data.playground.scoreBoard.playerTwoScore || client.data.playground.scoreBoard.playerOneScore
                    });
                    wss.to(client.data.roomname).emit('DisplayWinner', { winner: second.username, loser: client.data.user.username });
                }
                await this.pongGameService.deleteRoom(client.data.roomname);
                this.logger.log('Game in Room: ' + client.data.roomname + ' Finished');
            }
            client.leave(client.data.roomname);
            await this.usersService.updateStatus(client.data.user.id, player_status_enum_1.UserStatus.ONLINE);
        }
        else if (client.handshake.query.role === 'player') {
            await this.usersService.updateStatus(client.data.user.id, player_status_enum_1.UserStatus.ONLINE);
        }
        else if (client.handshake.query.role === 'spectator') {
            this.logger.log('spectator Disconnected: ' + client.id);
            client.leave(client.handshake.query.room);
        }
    }
    handleKeyUpPressed(client) {
        if (client.data.role === 'player' && client.data.side === 'left') {
            client.data.playground.leftPaddleController.keyUpPressed();
        }
        else if (client.data.role === 'player' && client.data.side === 'right') {
            client.data.playground.rightPaddleController.keyUpPressed();
        }
    }
    handleKeyDownPressed(client) {
        if (client.data.role === 'player' && client.data.side === 'left') {
            client.data.playground.leftPaddleController.keyDownPressed();
        }
        else if (client.data.role === 'player' && client.data.side === 'right') {
            client.data.playground.rightPaddleController.keyDownPressed();
        }
    }
    handleKeyUpUnpressed(client) {
        if (client.data.role === 'player' && client.data.side === 'left') {
            client.data.playground.leftPaddleController.keyUpUnpressed();
        }
        else if (client.data.role === 'player' && client.data.side === 'right') {
            client.data.playground.rightPaddleController.keyUpUnpressed();
        }
    }
    handleKeyDownUnpressed(client) {
        if (client.data.role === 'player' && client.data.side === 'left') {
            client.data.playground.leftPaddleController.keyDownUnpressed();
        }
        else if (client.data.role === 'player' && client.data.side === 'right') {
            client.data.playground.rightPaddleController.keyDownUnpressed();
        }
    }
    handleTouchMove(client, data) {
        if (client.data.role === 'player' && client.data.side === 'left') {
            client.data.playground.leftPaddle.touchMove(data.y, client.data.playground.bounds);
        }
        else if (client.data.role === 'player' && client.data.side === 'right') {
            client.data.playground.rightPaddle.touchMove(data.y, client.data.playground.bounds);
        }
    }
};
OneVOneService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [pong_game_service_1.PongGameService, players_service_1.UsersService])
], OneVOneService);
exports.OneVOneService = OneVOneService;
//# sourceMappingURL=one-v-one.service.js.map