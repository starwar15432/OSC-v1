    require('global');

const roomHandler = require ('roomHandler');
const profiler = require('screeps-profiler');

// https://github.com/gdborton/screeps-profiler
//profiler.enable();

global.resetGlobal = Game.time;

if (Game.cpu.bucket > 300) module.exports.loop = function () {
    if (Game.time == resetGlobal) {
        console.log('reset!');
        console.log(Game.cpu.bucket);
    }

    //screeps profiler wrapper
    // https://github.com/gdborton/screeps-profiler
    //profiler.wrap(function() {

        //quick grafana check
        if (Memory.stats == undefined) {
            Memory.stats = {}
        }

        try {
            //memory stuff
            if (Game.time % 13 == 0) {
                for (let name in Memory.creeps) {
                    if (!Game.creeps[name]) {
                        delete Memory.creeps[name];
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
                    if (Game.flags[flag] == undefined) {
                        delete Memory.flags[flag];
                    }
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

        //attack team flag stuff and global starts
        if (global['warCache'] == undefined) {
            global['warCache'] = {};
        }

        var attackTeamFlags = _.filter(Game.flags, f => f.memory.type == 'attackTeamFlag' && f.memory.team != undefined
    && f.memory.timeToAttack != undefined && f.memory.timeToAttack != null && f.memory.timeToRally != undefined && f.memory.timeToRally != null
    && f.memory.rallyFlag);
    
        for (let flag of attackTeamFlags) {
            if (global['warCache'][flag.memory.team] == undefined || Game.time % 3 == 0) {
                global['warCache'][flag.memory.team] = {
                    flag: flag,
                    rallyFlag: flag.memory.rallyFlag,
                    targetRoom: flag.pos.roomName,
                    timeToAttack: flag.memory.timeToAttack,
                    timeToRally: flag.memory.timeToRally
                };
            }
        }
        //attack team flag stuff and global ends

        for (let room_it in Game.rooms) {
            var room = Game.rooms[room_it];
            var controller = room.controller;
            if (controller) {
                if (controller.my === true) {

                    try {
                        if (Memory.rooms) {
                            if (!Memory.rooms[room]) {
                                Memory.rooms[room] = {};
                            }
                        }
                        else {
                            Memory.rooms = {};
                        }
                    }
                    catch (err) {
                        if (err !== null && err !== undefined) {
                            Game.notify("Error in Memory.room logic: \n" + err + "\n " + err.stack);
                            console.log("Error in Memory.room logic: \n" + err + "\n" + err.stack);
                        }
                    }
                    roomHandler.run(room);
                }
                else if (controller.reservation && controller.reservation.username == 'starwar15432') {
                    if (Game.time % 25 == 0) {
                        room.updateConstructionTargets();
                    }
                }
            }
        }

        try {

//Grafana stuff

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
            Memory.stats['cpu.getUsed'] = Game.cpu.getUsed();

        }
        catch (err) {
            if (err !== null && err !== undefined) {
                Game.notify("Error in Grafana stuff: \n" + err + "\n " + err.stack);
                console.log("Error in Grafana stuff: \n" + err + "\n" + err.stack);
            }
        }
    /*});*/
};
