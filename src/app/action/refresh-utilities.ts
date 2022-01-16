import { AppState } from "app/state/state";
import { Utility } from "app/state/utility";
import { NS } from "bitburner";
import { Host } from "lib/state/host";

export async function main(ns: NS) {
    const stateFile = ns.args[0] as string;
    const utility = ns.args[1] as Utility;

    let state = JSON.parse(ns.read(stateFile)) as AppState;
    state.utilities = Object.values(Utility).filter(util => ns.fileExists(util, Host.HOME));
    await ns.write(stateFile, [JSON.stringify(state)], "w");
}