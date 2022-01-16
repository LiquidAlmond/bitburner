import { AppState } from "app/state/state";
import { NS } from "bitburner";

export async function main(ns: NS) {
    const stateFile = ns.args[0] as string;

    let state = JSON.parse(ns.read(stateFile)) as AppState;
    state.inGang = true;
    await ns.write(stateFile, [JSON.stringify(state)], "w");
}