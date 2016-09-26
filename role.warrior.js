module.exports = {
    run: function (room, creep, allyUsername, isUnderAttack, isAttacking, armySize, roomToAttack, roomToRallyAt) {

        var creepAttackRange;
        if (creep.getActiveBodyparts(HEAL) >= 1) {
            //put creep healer code here
        }
        else if (creep.getActiveBodyparts(RANGED_ATTACK) >= 1) {
            creepAttackRange = 3;
            this.creepAttack(room, creep, allyUsername, isUnderAttack, creepAttackRange, isAttacking, armySize, roomToAttack, roomToRallyAt);
        }
        else if (creep.getActiveBodyparts(ATTACK) >= 1) {
            creepAttackRange = 1;
            this.creepAttack(room, creep, allyUsername, isUnderAttack, creepAttackRange, isAttacking, armySize, roomToAttack, roomToRallyAt);
        }

    },

    creepAttack: function (room, creep, allyUsername, isUnderAttack, creepAttackRange, isAttacking, armySize, roomToAttack, roomToRallyAt) {

        if (isUnderAttack === true) {
            if (creep.room.name == room) {
                var target = this.findTarget(room, creep, allyUsername);
                if (target) {
                    var rampart = this.findRampartNearTarget(room, creep, target, creepAttackRange);
                    if (rampart) {
                        if (creep.pos != rampart.pos) {
                            creep.moveTo(rampart);
                        }
                        else {
                            if (!creepAttackRange > 1) {
                                creep.attack(target)
                            }
                            else {
                                creep.rangedAttack(target);
                            }
                        }
                    }
                    else {
                        if (!creepAttackRange > 1) {
                            creep.attack(target)
                        }
                        else {
                            creep.rangedAttack(target);
                        }
                    }
                }
                else {
                    creep.say('All Clear', true);
                }
            }
            else {
                creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(room)));
            }
        }
        else if (isAttacking === true && roomToAttack && armySize > 0) {

            var target = this.findTarget(room, creep, allyUsername);

            if (Game.time < 14000631) {
                var rallyPoint = new RoomPosition(33, 6, roomToRallyAt);

                if (!creepAttackRange > 1) {
                    if (creep.attack(target) != 0) {
                        creep.moveTo(rallyPoint, {reusePath: 20});
                    }
                }
                else {
                    if (creep.rangedAttack(target) != 0) {
                        creep.moveTo(rallyPoint, {reusePath: 20});
                    }
                }
            }
            else {
                if (creep.room.name == roomToAttack) {
                    creep.moveTo(creep.findClosestByRange(room.findExitTo(roomToAttack)));
                }
                else {
                    var targetSpawn = creep.room.find(FIND_HOSTILE_SPAWNS)[0];
                    if (targetSpawn) {
                        if (creep.attack(targetSpawn) == ERR_NOT_IN_RANGE) {
                            if (creep.moveTo(targetSpawn) == ERR_NO_PATH) {
                                if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(target);
                                }
                            }
                        }
                    }
                    else {
                        if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    }
                 }
            }
        }
    },

    findTarget: function (room, creep, allyUsername) {

        var target;

        target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: (c) => c.getActiveBodyparts(HEAL) >= 1
            && allyUsername.includes(c.owner.username) == false
        });

        if (target) {
            return target;
        }
        else {
            target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                filter: (c) => c.getActiveBodyparts(ATTACK) >= 1
                && allyUsername.includes(c.owner.username) == false
            });

            if (target) {
                return target;
            }
            else {
                target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: (c) => allyUsername.includes(c.owner.username) == false});
                if (target) {
                    return target;
                }
                else {
                    return undefined;
                }
            }
        }
    },

    findRampartNearTarget: function (room, creep, target, creepAttackRange) {

        var rampart = target.pos.findInRange(FIND_MY_STRUCTURES, creepAttackRange, {filter: (s) => s.structureType == STRUCTURE_RAMPART && s.findInRange(FIND_CREEPS, 1).length == 0})[0];

        if (rampart) {
            return rampart;
        }
        else {
            return undefined;
        }
    }
};