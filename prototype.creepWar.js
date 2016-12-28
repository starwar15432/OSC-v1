require('prototype.creep')();

module.exports = function () {
    Creep.prototype.needTeam =
        function () {
            console.log(creep.memory.role + ' creep ' + this.name + ' At pos ' + this.pos + ' needs a team');
            creep.moveTo(global[room.name].guardStationFlag);
        };

    Creep.prototype.basicRangedHandler =
        function (target) {
            if (target) {
                if (this.hasActiveBodyparts(RANGED_ATTACK)) {
                    this.rangedAttack(target);
                }
            }
        };

        Creep.prototype.basicSelfHeal =
        function () {
            if (this.hasActiveBodyparts(HEAL)) {
                if (this.hits < this.hitsMax) {
                    this.heal(this);
                }
            }
        };

        Creep.prototype.beforeRally =
        function (room, teamGlobal) {
            var timeToRally = Game.time >= teamGlobal.timeToRally;
            if (timeToRally != undefined && timeToRally != null) {
                if (Game.time >= timeToRally) {
                    var rallyFlag = teamGlobal.rallyFlag;
                    if (rallyFlag) {
                        creep.moveTo(rallyFlag, {ignoreRoads: true});
                    }
                    else {
                        // something here
                        creep.moveTo(global[room.name].guardStationFlag);
                    }
                }
                else {
                    creep.moveTo(global[room.name].guardStationFlag);
                }
            }
        };
};