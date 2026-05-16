const loadscreen = GetCurrentResourceName();

/**
 * @param {string} name
 * @param {(reason: string) => void} _setKickReason
 * @param {Deferrals} deferrals
 */
function onPlayerConnecting(name, _setKickReason, deferrals) {
    console.log(`^2[madd_loadingscreen]^7 Player connecting: ${name}`);

    /** @type {Object} */
    const data = {
        vars: {
            playerName: name,
            serverName: GetConvar('sv_projectName', GetConvar('sv_hostname', 'Madd Stuffs')),
        }
    };

    deferrals.handover(data);
}

on('playerConnecting', onPlayerConnecting);