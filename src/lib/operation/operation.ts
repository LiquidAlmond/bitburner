export enum Operation {
    STATE_MANAGER = "state",
    NUKE = "nuke",
    SCP = "scp",
    HACKING = "hacking",
    HACKNET = "hacknet",
    GANG = "gang",
    STOCK = "stock",
    KILLALL = "killall",
    CLEAN = "clean",
    SERVERS = "servers",
    SERVER_UPDATES = "server-updates",
    CONTRACTS = 'contracts',
}

const scripts = {
    [Operation.STATE_MANAGER]: "/lib/state/state-manager.js",
    [Operation.NUKE]: "/app/operation/nuke.js",
    [Operation.SCP]: "/app/operation/scp.js",
    [Operation.HACKING]: "/app/operation/hack-loop.js",
    [Operation.HACKNET]: "/app/operation/hacknet.js",
    [Operation.GANG]: "/app/operation/gang.js",
    [Operation.STOCK]: "/app/operation/stock.js",
    [Operation.KILLALL]: "/util/killall.js",
    [Operation.CLEAN]: "/util/clean-all-hosts.js",
    [Operation.SERVERS]: "/app/operation/servers.js",
    [Operation.SERVER_UPDATES]: "/app/operation/server-updates.js",
    [Operation.CONTRACTS]: "/app/operation/contract.js",
};

export function getOperationScript(op: Operation): string {
    return scripts[op];
}