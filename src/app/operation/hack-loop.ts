import { Action } from "app/state/action";
import { AppState, Server } from "app/state/state";
import { NS } from "bitburner";
import { Operation } from "lib/operation/operation";
import { Host } from "lib/state/host";
import { Store } from "lib/state/state";

export async function main(ns: NS) {
    ns.disableLog("ALL");

    const store = new Store<AppState>(ns);
    let state = store.state;

    while (state.enabled.includes(Operation.HACKING)) {
        const hosts = state.usableHosts
            .filter(host => host.ram > 0 && host.name !== Host.HOME)
            .filter(host => host.hasAdmin);
        
        for (let host of hosts) {
            const freeThreads = Math.trunc((host.ram - ns.getServerUsedRam(host.name)) / ns.getScriptRam("hack.js", "home"));
            if (freeThreads === 0) continue;
            const threadsToUse = Math.min(freeThreads, 32);
            ns.exec("hack.js", host.name, freeThreads);
        }

        await ns.sleep(1000);
        state = store.state;
    }
}