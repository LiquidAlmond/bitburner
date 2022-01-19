import { AppState } from "app/state/state";
import { NS } from "bitburner";
import { Operation } from "lib/operation/operation";
import { Host } from "lib/state/host";
import { Store } from "lib/state/state";

function getBatches(ns: NS) {
    return Object.values(Host)
        .filter(host => ns.serverExists(host))
        .filter(host => ns.getServer(host).hasAdminRights)
        .filter(host => ns.getServer(host).maxRam >= 1.7)
        .map(host => ({ name: host, ram: ns.getServerMaxRam(host) - (host === Host.HOME ? 100 : 0) }));
}

function getBatch(ns: NS): { name: Host; threads: number } {
    return getBatches(ns)
        .map(host => ({ name: host.name, threads: Math.floor((host.ram - ns.getServer(host.name).ramUsed) / 2) }))
        .filter(batch => batch.threads > 0)
        .find(() => true);
}

export async function main(ns: NS) {
    ns.disableLog("ALL");

    const store = new Store<AppState>(ns);
    let state = store.state;

    let target: Host;
    let goal: "XP" | "Money";

    for (let host of Object.values(Host).filter(host => ns.serverExists(host))) {
        ns.scriptKill("/app/script/hack.js", host);
        ns.scriptKill("/app/script/grow.js", host);
        ns.scriptKill("/app/script/weaken.js", host);
    }

    while (state.enabled.includes(Operation.HACKING)) {
        if (target === state.hacking.target && goal === state.hacking.goal) {
            await ns.sleep(30000);
            continue;
        }

        target = state.hacking.target;
        goal = state.hacking.goal;

        const totalThreads = getBatches(ns)
            .map(batch => Math.floor(batch.ram / 1.75))
            .reduce((sum, thread) => sum + thread, 0);

        const hackThreads = Math.floor(totalThreads * 0.07);
        const growThreads = Math.floor(totalThreads * 0.7);
        const weakenThreads = totalThreads - hackThreads - growThreads;
        
        let activeThreads = {
            hack: 0,
            grow: 0,
            weaken: 0,
        }

        while (activeThreads.weaken < weakenThreads || activeThreads.grow < growThreads || activeThreads.hack < hackThreads) {
            const batch = getBatch(ns);
            if (!batch) break;
            if (activeThreads.weaken < weakenThreads) {
                const newThreads = Math.min(128, batch.threads, weakenThreads - activeThreads.weaken);
                ns.print(`Starting ${newThreads} threads on ${batch.name} to weaken`);
                ns.exec("/app/script/weaken.js", batch.name, newThreads, Math.random());
                activeThreads.weaken += newThreads;
                await ns.sleep(Math.random() * 500);
                continue;
            }
            if (activeThreads.grow < growThreads) {
                const newThreads = Math.min(128, batch.threads, growThreads - activeThreads.grow);
                ns.print(`Starting ${newThreads} threads on ${batch.name} to grow`);
                ns.exec("/app/script/grow.js", batch.name, newThreads, Math.random());
                activeThreads.grow += newThreads;
                await ns.sleep(Math.random() * 500);
                continue;
            }
            if (activeThreads.hack < hackThreads) {
                const newThreads = Math.min(128, batch.threads, hackThreads - activeThreads.hack);
                ns.print(`Starting ${newThreads} threads on ${batch.name} to hack`);
                ns.exec("/app/script/hack.js", batch.name, newThreads, Math.random());
                activeThreads.hack += newThreads;
                await ns.sleep(Math.random() * 500);
                continue;
            }
        }
    }
}