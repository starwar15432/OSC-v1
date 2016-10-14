require('global');

const roomHandler = require ('roomHandler');

module.exports.loop = function () {

    try {

        //memory stuff
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
            else if (!Memory.creeps[name].room) {
                Memory.creeps[name].room = '' + Game.creeps[name].room.name;
            }
        }
        for (let spawn in Memory.spawns) {
            if (!Game.spawns[spawn]) {
                delete Memory.spawns[spawn];
            }
            else if (!Memory.spawns[spawn].room) {
                Memory.spawns[spawn].room = '' + Game.spawns[spawn].room.name;
            }
        }
        for (let flag in Memory.flags) {
            if (!Game.flags[flag]) {
                delete Memory.spawns[flag];
            }

        }

    }
    catch (err) {
        if (err !== null && err !== undefined) {
            Game.notify("Error in memory management logic: \n" + err + "\n " + err.stack);
            console.log("Error in memory management logic: \n" + err + "\n" + err.stack);
        }
    }

    //do actual stuff
    for (let room_it in Game.rooms) {
        var room = Game.rooms[room_it];
        var spawn = room.find(FIND_MY_SPAWNS)[0];
        if (spawn) {

            if (!Memory.rooms[room]) {
                Memory.rooms[room] = {};
            }

            roomHandler.run(room);
        }
    }

    try {

//Grafana stuff
        if (Memory.stats == undefined) {
            Memory.stats = {}
        }


        Memory.stats['gcl.progress'] = Game.gcl.progress;
        Memory.stats['gcl.progressTotal'] = Game.gcl.progressTotal;
        Memory.stats['gcl.level'] = Game.gcl.level;

        var spawns = Game.spawns;
        for (let spawnKey in spawns) {
            let spawn = Game.spawns[spawnKey];
            Memory.stats['spawn.' + spawn.name + '.defenderIndex'] = spawn.memory['defenderIndex']
        }


        Memory.stats['cpu.bucket'] = Game.cpu.bucket;
        Memory.stats['cpu.limit'] = Game.cpu.limit;
        Memory.stats['cpu.getUsed'] = Game.cpu.getUsed()

    }
    catch (err) {
        if (err !== null && err !== undefined) {
            Game.notify("Error in Grafana stuff: \n" + err + "\n " + err.stack);
            console.log("Error in Grafana stuff: \n" + err + "\n" + err.stack);
        }
    }
};