import { Host } from "lib/state/host";
import { AppState } from "app/state/state";
import { NS } from "bitburner";

export async function main(ns: NS) {
    const stateFile = ns.args[0] as string;
    const id = ns.args[1] as number;
    const target = ns.args[2] as Host;

    let state = JSON.parse(ns.read(stateFile)) as AppState;
    state.hacking.processes.find(proc => proc.id === id).target = target;
    await ns.write(stateFile, [JSON.stringify(state)], "w");
}