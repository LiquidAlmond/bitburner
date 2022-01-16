import { Action } from "app/state/action";
import { AppState } from "app/state/state";
import { NS } from "bitburner";
import { Operation } from "lib/operation/operation";
import { Store } from "lib/state/state";

function getExecutables(ns: NS): Executable[] {
    return [
        { file: "BruteSSH.exe", runner: ns.brutessh },
        { file: "relaySMTP.exe", runner: ns.relaysmtp },
        { file: "SQLInject.exe", runner: ns.sqlinject },
        { file: "FTPCrack.exe", runner: ns.ftpcrack },
        { file: "HTTPWorm.exe", runner: ns.httpworm },
    ]
}

export async function main(ns: NS) {
    ns.disableLog("ALL");
    
    const store = new Store<AppState>(ns);
    let state = store.state;

    const executables = getExecutables(ns);

    while (state.enabled.includes(Operation.NUKE)) {
        const servers = state.usableHosts.filter(host => !host.hasAdmin);

        for (let server of servers) {
            const utilities = state.utilities.filter(util => !server.openPorts.includes(util));
            for (let util of utilities) {
                await executables.find(exe => exe.file === util).runner(server.name);
                await store.dispatch({ script: Action.OPEN_PORT, parameters: [server.name, util] });
            }
        }
        
        await ns.sleep(500);
        state = store.state;

        const serversToNuke = servers
            .filter(server => !server.hasAdmin)
            .filter(server => server.requiredPorts <= server.openPorts.length);
        for (let server of serversToNuke) {
            ns.nuke(server.name);
            await store.dispatch({ script: Action.GRANT_ADMIN, parameters: [server.name] });
        }

        await ns.sleep(1000);
        state = store.state;
    }
}

interface Executable {
    file: string;
    runner: (host: string) => void;
}