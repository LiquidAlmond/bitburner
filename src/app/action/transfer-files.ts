import { Host } from "lib/state/host";
import { AppState } from "app/state/state";
import { NS } from "bitburner";

export async function main(ns: NS) {
    const stateFile = ns.args[0] as string;
    const host = ns.args[1] as Host;

    let state = JSON.parse(ns.read(stateFile)) as AppState;
    state.usableHosts.find(h => h.name === host).hasScripts = true;
    await ns.write(stateFile, [JSON.stringify(state)], "w");
}