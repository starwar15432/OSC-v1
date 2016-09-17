module.exports = {
    run: function (room, creep, hitsOfDefence) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {
            var rampartToRepair = this.findRampart(room, hitsOfDefence);

            if (rampartToRepair != undefined) {
                if (creep.repair(rampartToRepair) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(rampartToRepair);
                }
            }
            else {
                var wallToRepair = this.findRampart(room, hitsOfDefence);

                if (wallToRepair != undefined) {
                    if (creep.repair(wallToRepair) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(wallToRepair);
                    }
                }
            }
        }
        else {

            var storage = room.storage;
            if (storage) {
                if (storage.store[RESOURCE_ENERGY] > 0) {
                    if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage)
                    }
                }
            }
            else {
                var container = this.findContainer(room, creep);
                if (container) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container)
                    }
                }
            }
        }
    },

    findContainer: function (room, creep) {
        var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_CONTAINER
            && s.store > 0
        });
        if (container) {
            return container;
        }
        else {
            return undefined;
        }
    },

    findRampart: function (room, hitsOfDefence) {
        var rampart = _.min(room.find(FIND_STRUCTURES,
            {filter: (s) => s.structureType == STRUCTURE_RAMPART && s.hits <= hitsOfDefence}), s < s.hits);

        return rampart;
    },

    findWall: function (room, hitsOfDefence) {
        var wall = _.min(room.find(FIND_STRUCTURES,
            {filter: (s) => s.structureType == STRUCTURE_WALL && s.hits <= hitsOfDefence}), s < s.hits);

        return wall;
    }
};