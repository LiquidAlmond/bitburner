import { Host } from "lib/state/host";
import { AppState } from "app/state/state";
import { NS } from "bitburner";

export async function main(ns: NS) {
    const stateFile = ns.args[0] as string;
    const host = ns.args[1] as Host;
    const ram = ns.args[2] as number;

    let state = JSON.parse(ns.read(stateFile)) as AppState;
    state.usableHosts.find(h => h.name === host).ram = ram;
    await ns.write(stateFile, [JSON.stringify(state)], "w");
}