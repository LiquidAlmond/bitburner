import { AppState } from "app/state/state";
import { NS } from "bitburner";
import { getOperationScript, Operation } from "lib/operation/operation";

export async function main(ns: NS) {
    const stateFile = ns.args[0] as string;
    const operation = ns.args[1] as Operation;

    let state = JSON.parse(ns.read(stateFile)) as AppState;
    state.enabled.push(operation);
    await ns.write(stateFile, [JSON.stringify(state)], "w");
    ns.spawn(getOperationScript(operation), 1, stateFile, ...(ns.args.slice(2) as string[] ?? []));
}