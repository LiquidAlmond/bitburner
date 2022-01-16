import { AppState } from "app/state/state";
import { NS } from "bitburner";

export async function main(ns: NS) {
    const stateFile = ns.args[0] as string;
    const goal = ns.args[1] as "XP" | "Money";

    let state = JSON.parse(ns.read(stateFile)) as AppState;
    state.hacking.goal = goal;
    await ns.write(stateFile, [JSON.stringify(state)], "w");
}