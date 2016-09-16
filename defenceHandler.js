var towerHandler = require('towerHandler');

module.exports = {
    run: function (room, allyUsername) {
        var hostileCreepsInRoom = JSON.stringify(this.getHostileCreeps(room));

        console.log('Enemy creeps spotted in room ' + room);
        console.log('The creeps are' + hostileCreepsInRoom);
        console.log('Prepare to die future self');

        Game.notify('Enemy creeps spotted in room ' + room);
        Game.notify('The creeps are' + hostileCreepsInRoom);
        Game.notify('Prepare to die future self');


        var towers = room.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER});

        for (let tower in towers) {
            towerHandler.run(tower, allyUsername);
        }

    },

    getHostileCreeps: function (room, allyUsername) {
        var hostileCreepsInRoom = room.find(FIND_HOSTILE_CREEPS, {filter: (c) => allyUsername.includes(c.owner.username) == false});
        return hostileCreepsInRoom;
    },

    isUnderAttack: function (room, allyUsername) {

        var hostileCreepsInRoom = this.getHostileCreeps(room, allyUsername)[0];

        if (!hostileCreepsInRoom) {
            return false;
        }
        else {
            return true;
        }
    }
};