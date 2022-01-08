import { NS, Server } from "bitburner";
import { getHosts } from "util/get-hosts";

// TODO: Design algorithm that works regardless of whether we have formulas.exe
function selectTarget(ns: NS, hosts: Server[]): Server {
    //return getHosts(ns).filter(host => ns.formulas.hacking.hackTime(ns.getServer(host), ns.getPlayer()) < 15)
    //    .sort((a,b) => ns.getServer(b).requiredHackingSkill - ns.getServer(a).requiredHackingSkill)
    return ns.getServer("harakiri-sushi");
}

function startHack(ns: NS, host: string, target: string): void {
    ns.exec("hack.js", host, calcThreads(ns, ns.getServer(host)), target);
}

function calcThreads(ns: NS, server: Server): number {
    return Math.floor((server.maxRam - server.ramUsed) / ns.getScriptRam("hack.js", "home"));
}

function killHack(ns: NS, host: Server): void {
    ns.ps(host.hostname)
        .filter(process => process.filename === "hack.js")
        .forEach(process => ns.kill(process.filename, host.hostname, ...process.args));
}

export async function main(ns: NS) {
    ns.disableLog("ALL");

    let hosts = getHosts(ns).map(host => ns.getServer(host))
    let hostsWithSpace = hosts.filter(server => calcThreads(ns, server) > 0 && server.hostname !== "home");
    let target = selectTarget(ns, hosts);

    hostsWithSpace.filter(host => ns.scriptRunning("hack.js", host.hostname))
        .forEach(host => killHack(ns, host));

    while (hostsWithSpace.some(server => !ns.scriptRunning("hack.js", server.hostname))) {
        hosts.filter(server => !ns.scriptRunning("hack.js", server.hostname))
            .filter(server => server.hasAdminRights)
            .forEach(server => startHack(ns, server.hostname, target.hostname));
        await ns.sleep(1000);
    }
}