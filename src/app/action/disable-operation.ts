import { AppState } from "app/state/state";
import { NS } from "bitburner";
import { getOperationScript, Operation } from "lib/operation/operation";
import { Host } from "lib/state/host";

export async function main(ns: NS) {
    const stateFile = ns.args[0] as string;
    const operation = ns.args[1] as Operation;

    let state = JSON.parse(ns.read(stateFile)) as AppState;
    state.enabled = state.enabled.filter(op => op !== operation);
    ns.scriptKill(getOperationScript(operation), Host.HOME);
    await ns.write(stateFile, [JSON.stringify(state)], "w");
}