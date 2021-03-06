require('global');

module.exports = function () {
    StructureSpawn.prototype.createCustomCreep =
        function (room, energy, roleName, amountToSave) {

            var numberOfParts;
            var body = [];

            var spawn = this;

            var creepName = function (roleName) {
                var name = roleName + '-' + Game.time % 100000 + '-' + spawn.pos.x + spawn.pos.y;
                return name;
            };

            var sortedParts = function (body) {
                if (body == undefined) return undefined;
                return _(body).sortBy(function (part) {
                        if (part === TOUGH)
                            return 0;
                        else if (part === HEAL)
                            return BODYPARTS_ALL.length;
                        else
                            return _.random(1, BODYPARTS_ALL.length - 1);
                    })
                    .value();
            };

            switch (roleName) {
                case 'harvester':
                    numberOfParts = Math.floor(((energy - (energy * amountToSave)) - 200) / 100);

                    if (numberOfParts > 0) {
                        if (numberOfParts > 6) {
                            numberOfParts = 6;
                        }
                        body.push(MOVE);
                        body.push(MOVE);
                        body.push(MOVE);
                        body.push(CARRY);
                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(WORK);
                        }
                    }
                    return this.createCreep(sortedParts(body), creepName(roleName), {role: roleName, room: room.name, working: false});
                case 'distributor':
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 150);
                    if (numberOfParts > 0) {
                        if (numberOfParts > 16) numberOfParts = 16;

                            for (let i = 0; i < numberOfParts; i++) {
                                body.push(CARRY);
                                body.push(CARRY);
                                body.push(MOVE);
                            }
                    }
                    return this.createCreep(sortedParts(body), creepName(roleName), {role: roleName, room: room.name, working: false});
                case 'carrier':
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 150);
                    if (numberOfParts > 0) {

                        if (numberOfParts > Memory.rooms[room].partsForCarrier) {
                            numberOfParts = Memory.rooms[room].partsForCarrier;
                        }

                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(CARRY);
                            body.push(CARRY);
                            body.push(MOVE);
                        }
                    }
                    return this.createCreep(sortedParts(body), creepName(roleName), {role: roleName, room: room.name, working: false});
                case 'warrior':
                    var numberOfRanged = _.sum(Game.creeps, (c) => c.memory.role == 'warrior' && c.memory.room == room.name && c.getActiveBodyparts(RANGED_ATTACK) >= 1);
                    var numberOfAttack = _.sum(Game.creeps, (c) => c.memory.role == 'warrior' && c.memory.room == room.name && c.getActiveBodyparts(ATTACK) >= 1);


                    if (numberOfRanged <= 3) {
                        numberOfParts = Math.floor((energy - (energy * amountToSave)) / 200);
                        if (numberOfParts > 0) {
                            if (numberOfParts > 25) numberOfParts = 25;

                            if (numberOfParts > 5) {
                                numberOfParts = 5;
                            }
                            for (let i = 0; i < numberOfParts; i++) {
                                body.push(MOVE);
                                body.push(RANGED_ATTACK);
                            }
                        }
                    }
                    else if (numberOfAttack < 10) {
                        numberOfParts = Math.floor((energy - (energy * amountToSave)) / 210);
                        if (numberOfParts > 0) {
                            if (numberOfParts > 16) numberOfParts = 16;

                            if (numberOfParts > 5) {
                                numberOfParts = 5;
                            }
                            for (let i = 0; i < numberOfParts; i++) {
                                body.push(MOVE);
                                body.push(ATTACK);
                                body.push(ATTACK);
                            }
                        }
                    }
                    else {
                        numberOfParts = Math.floor((energy - (energy * amountToSave)) / 300);
                        if (numberOfParts > 0) {
                            if (numberOfParts > 25) numberOfParts = 25;

                            for (let i = 0; i < numberOfParts; i++) {
                                body.push(MOVE);
                                body.push(HEAL);
                            }
                        }
                    }
                    return this.createCreep(sortedParts(body), creepName(roleName), {role: roleName, room: room.name, working: false});
                case 'upgrader':
                    numberOfParts = Math.floor(((energy - (energy * amountToSave)) - 50) / 150);
                    if (numberOfParts > 0) {

                        if (Memory.rooms[room].energyMode == 'saving' && numberOfParts > 7) {
                            numberOfParts = 10;
                        }
                        else if (numberOfParts > 24) numberOfParts = 24;
                        
                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(MOVE);
                            body.push(WORK);
                        }
                        body.push(CARRY);
                    }
                    return this.createCreep(sortedParts(body), creepName(roleName), {role: roleName, room: room.name, working: false});
                case 'builder':
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 200);
                    if (numberOfParts > 0) {
                        if (numberOfParts > 16) numberOfParts = 16;

                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(WORK);
                            body.push(CARRY);
                            body.push(MOVE);
                        }
                    }
                    return this.createCreep(sortedParts(body), creepName(roleName), {role: roleName, room: room.name, working: false});
                case 'repairer':
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 200);
                    if (numberOfParts > 0) {
                        if (numberOfParts > 16) numberOfParts = 16;

                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(WORK);
                            body.push(CARRY);
                            body.push(MOVE);
                        }
                    }
                    return this.createCreep(sortedParts(body), creepName(roleName), {role: roleName, room: room.name, working: false});
                case 'defenceManager':
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 200);
                    if (numberOfParts > 0) {
                        if (numberOfParts > 16) numberOfParts = 16;

                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(WORK);
                            body.push(CARRY);
                            body.push(MOVE);
                        }
                    }
                    return this.createCreep(sortedParts(body), creepName(roleName), {role: roleName, room: room.name, working: false});
                case 'landlord':
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 650);
                    if (numberOfParts > 0) {
                        if (numberOfParts > 25) numberOfParts = 25;

                        if (numberOfParts >= 1) {
                            body.push(CLAIM);
                            body.push(MOVE);
                        }
                    }
                    return this.createCreep(sortedParts(body), creepName(roleName), {role: roleName, room: room.name, working: false});
                case 'remoteHarvester':
                    numberOfParts = Math.floor(((energy - (energy * amountToSave)) - 100) / 150);
                    if (numberOfParts > 0) {
                        if (numberOfParts > 7) {
                            numberOfParts = 7;
                        }
                        body.push(CARRY);
                        body.push(MOVE);
                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(MOVE);
                            body.push(WORK);
                        }
                    }
                    return this.createCreep(sortedParts(body), creepName(roleName), {role: roleName, room: room.name, working: false});
                case 'remoteHauler':
                    numberOfParts = Math.floor(((energy - (energy * amountToSave)) - 150) / 150);
                    if (numberOfParts > 0) {
                        if (numberOfParts > 16) numberOfParts = 16;

                        body.push(WORK);
                        body.push(MOVE);
                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(MOVE);
                            body.push(CARRY);
                            body.push(CARRY);
                        }
                    }
                    return this.createCreep(sortedParts(body), creepName(roleName), {role: roleName, room: room.name, goingHome: false});
                case 'otherRoomCreep':
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 200);
                    if (numberOfParts > 0) {
                        if (numberOfParts > 16) numberOfParts = 16;

                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(WORK);
                            body.push(MOVE);
                            body.push(CARRY);
                        }
                    }
                    return this.createCreep(sortedParts(body), creepName(roleName), {role: roleName, room: room.name, working: false});
                case 'energyThief':
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 100);
                    if (numberOfParts > 0) {
                        if (numberOfParts > 25) numberOfParts = 25;

                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(CARRY);
                            body.push(MOVE);
                        }
                    }
                    return this.createCreep(sortedParts(body), creepName(roleName), {role: roleName, room: room.name, working: false});
                case 'energyHelper':
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 100);
                    if (numberOfParts > 0) {
                        if (numberOfParts > 25) numberOfParts = 25;

                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(CARRY);
                            body.push(MOVE);
                        }
                    }
                    return this.createCreep(sortedParts(body), creepName(roleName), {role: roleName, room: room.name, working: false});
                case 'miner':
                    numberOfParts = Math.floor(((energy - (energy * amountToSave)) - 50) / 250);

                    if (numberOfParts > 0) {
                        if (numberOfParts > 24) numberOfParts = 24;

                        body.push(CARRY);
                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(MOVE);
                            body.push(WORK);
                        }
                    }
                    return this.createCreep(sortedParts(body), creepName(roleName), {role: roleName, room: room.name, working: false});
                case 'marketMover':
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 150);
                    if (numberOfParts > 0) {
                        if (numberOfParts > 16) numberOfParts = 16;

                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(CARRY);
                            body.push(CARRY);
                            body.push(MOVE);
                        }
                    }
                    return this.createCreep(sortedParts(body), creepName(roleName), {role: roleName, room: room.name, working: false});
                case 'guard':
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 340);
                    if (numberOfParts > 1) {
                        if (numberOfParts > 10) numberOfParts = 10;

                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(RANGED_ATTACK);
                            body.push(ATTACK);
                            body.push(TOUGH);
                            body.push(MOVE);
                            body.push(MOVE);
                        }

                    }
                    else {
                        numberOfParts = Math.floor((energy - (energy * amountToSave)) / 280);
                        if (numberOfParts > 16) numberOfParts = 16;

                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(RANGED_ATTACK);
                            body.push(ATTACK);
                            body.push(MOVE);
                        }

                    }
                    return this.createCreep(sortedParts(body), creepName(roleName), {role: roleName, room: room.name, working: false});
                case 'creepHarasser':
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 340);
                    if (numberOfParts > 1) {
                        if (numberOfParts > 10) numberOfParts = 10;

                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(RANGED_ATTACK);
                            body.push(ATTACK);
                            body.push(TOUGH);
                            body.push(MOVE);
                            body.push(MOVE);
                        }

                    }
                    else {
                        numberOfParts = Math.floor((energy - (energy * amountToSave)) / 280);
                        if (numberOfParts > 16) numberOfParts = 16;

                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(RANGED_ATTACK);
                            body.push(ATTACK);
                            body.push(MOVE);
                        }

                    }
                    return this.createCreep(sortedParts(body), creepName(roleName), {role: roleName, room: room.name, working: false});
                case 'spawnSmasher':
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 340);
                    if (numberOfParts > 1) {
                        if (numberOfParts > 10) numberOfParts = 10;

                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(RANGED_ATTACK);
                            body.push(ATTACK);
                            body.push(TOUGH);
                            body.push(MOVE);
                            body.push(MOVE);
                        }

                    }
                    else {
                        numberOfParts = Math.floor((energy - (energy * amountToSave)) / 280);
                        if (numberOfParts > 16) numberOfParts = 16;

                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(RANGED_ATTACK);
                            body.push(ATTACK);
                            body.push(MOVE);
                        }

                    }
                    return this.createCreep(sortedParts(body), creepName(roleName), {role: roleName, room: room.name, working: false});
                case 'structureDestroyer':
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 340);
                    if (numberOfParts > 1) {
                        if (numberOfParts > 10) numberOfParts = 10;

                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(RANGED_ATTACK);
                            body.push(ATTACK);
                            body.push(TOUGH);
                            body.push(MOVE);
                            body.push(MOVE);
                        }

                    }
                    else {
                        numberOfParts = Math.floor((energy - (energy * amountToSave)) / 280);
                        if (numberOfParts > 16) numberOfParts = 16;

                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(RANGED_ATTACK);
                            body.push(ATTACK);
                            body.push(MOVE);
                        }

                    }
                    return this.createCreep(sortedParts(body), creepName(roleName), {role: roleName, room: room.name, working: false});
                case 'wallBreaker':
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 340);
                    if (numberOfParts > 1) {
                        if (numberOfParts > 10) numberOfParts = 10;

                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(RANGED_ATTACK);
                            body.push(ATTACK);
                            body.push(TOUGH);
                            body.push(MOVE);
                            body.push(MOVE);
                        }

                    }
                    else {
                        numberOfParts = Math.floor((energy - (energy * amountToSave)) / 280);
                        if (numberOfParts > 16) numberOfParts = 16;

                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(RANGED_ATTACK);
                            body.push(ATTACK);
                            body.push(MOVE);
                        }

                    }
                    return this.createCreep(sortedParts(body), creepName(roleName), {role: roleName, room: room.name, working: false});
                case 'warHealer':
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 300);
                    if (numberOfParts > 0) {
                        if (numberOfParts > 25) numberOfParts = 25;

                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(HEAL);
                            body.push(MOVE);
                        }

                    }
                    return this.createCreep(sortedParts(body), creepName(roleName), {role: roleName, room: room.name, working: false});
                case 'towerDrainer':
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 310);
                    if (numberOfParts > 1) {
                        if (numberOfParts > 16) numberOfParts = 16;

                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(TOUGH);
                            body.push(HEAL);
                            body.push(MOVE);
                        }

                    }
                    else {
                        numberOfParts = Math.floor((energy - (energy * amountToSave)) / 280);
                        if (numberOfParts > 25) numberOfParts = 25;

                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(HEAL);
                            body.push(MOVE);
                        }

                    }
                    return this.createCreep(sortedParts(body), creepName(roleName), {role: roleName, room: room.name, working: false});
                default:
                    return undefined;
            }
            
        };
};