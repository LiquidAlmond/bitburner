import { AppState } from "app/state/state";
import { Utility } from "app/state/utility";
import { NS } from "bitburner";

export async function main(ns: NS) {
    const stateFile = ns.args[0] as string;
    const utility = ns.args[1] as Utility;

    let state = JSON.parse(ns.read(stateFile)) as AppState;
    state.utilities.push(utility);
    await ns.write(stateFile, [JSON.stringify(state)], "w");
}