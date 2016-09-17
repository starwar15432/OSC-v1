module.exports = {
    run: function (room, creep) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {

            var storage = room.storage;

            if (storage) {
                if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
            }
            else {
                creep.say('ERROR!!!', true);
                console.log('Creep ' + creep + ' could not find structure storage in room ' + room);
            }
        }
        else {

            var droppedenergy = this.findDroppedEnergy(room, creep);
            if (droppedenergy) {
                if (creep.pickup(droppedenergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedenergy)
                }
            }
            else {
                var container = this.findContainers(room, creep);
                if (container) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container)
                    }
                }
            }

        }
    },

    findDroppedEnergy: function (room, creep) {
        var droppedEnergy = creep.find(FIND_DROPPED_ENERGY);
        if (droppedEnergy) {
            return droppedEnergy;
        }
        else {
            return undefined;
        }

    },

    findContainers: function (room, creep) {
        var container = creep.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER
        && s.store < s.storeCapacity});
        if (container) {
            return container;
        }
        else {
            return undefined;
        }

    }
};