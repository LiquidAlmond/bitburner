import { defaultState } from "app/state/state";
import { NS } from "bitburner";

export async function main(ns: NS) {
    const stateFile = ns.args[0] as string;
    await ns.write(stateFile, [JSON.stringify(defaultState)], "w");
}