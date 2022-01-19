import { Action } from "app/state/action";
import { AppState } from "app/state/state";
import { NS } from "bitburner";
import { Operation } from "lib/operation/operation";
import { Host } from "lib/state/host";
import { Store } from "lib/state/state";

const files: string[] = [
    "hack.js",
    "/app/state/state.js",
    "/lib/state/state.js",
    "/lib/state/host.js",
    "/lib/state/port.js",
    "/lib/operation/operation.js",
    "/app/state/utility.js",
    "/lib/contract/evaluate.js",
    "/app/script/grow.js",
    "/app/script/hack.js",
    "/app/script/weaken.js",
];

export async function main(ns: NS) {
    ns.disableLog("ALL");

    const store = new Store<AppState>(ns);
    let state = store.state;

    while (state.enabled.includes(Operation.SCP)) {
        const hosts = state.usableHosts.filter(host => ns.serverExists(host.name))
            .filter(host => !files.every(file => ns.fileExists(file, host.name)));
        for (let host of hosts) {
            await ns.scp(files, Host.HOME, host.name);
            await store.dispatch({ script: Action.TRANSFER_FILES, parameters: [host.name] });
            await ns.sleep(100);
        }
        await ns.sleep(5000);
        state = store.state;
    }
}