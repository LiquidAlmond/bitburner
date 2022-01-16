import { Host } from "lib/state/host";
import { AppState } from "app/state/state";
import { Utility } from "app/state/utility";
import { NS } from "bitburner";

export async function main(ns: NS) {
    const stateFile = ns.args[0] as string;
    const host = ns.args[1] as Host;
    const port = ns.args[2] as Utility;

    let state = JSON.parse(ns.read(stateFile)) as AppState;
    state.usableHosts.find(h => h.name === host).openPorts.push(port);
    await ns.write(stateFile, [JSON.stringify(state)], "w");
}