import { AppState } from "app/state/state";
import { NS } from "bitburner";
import { Port } from "lib/state/port";

export async function main(ns: NS) {
    const stateFile = ns.args[0] as string;
    const file = ns.args[1] as string;

    let state = JSON.parse(ns.read(stateFile)) as AppState;
    state.hacking.files.push(file);
    await ns.write(stateFile, [JSON.stringify(state)], "w");
}