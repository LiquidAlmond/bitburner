import { NS, Server } from "bitburner";
import { getHosts } from "util/get-hosts";

interface ServerInfo {
    name: string;
    open: number;
    required: number;
}

interface Executable {
    file: string;
    runner: (host: string) => void;
    alreadyRan: boolean;
}

function getExecutables(ns: NS, server: Server): Executable[] {
    return [
        { file: "BruteSSH.exe", runner: ns.brutessh, alreadyRan: server.sshPortOpen },
        { file: "relaySMTP.exe", runner: ns.relaysmtp, alreadyRan: server.smtpPortOpen },
        { file: "SQLInject.exe", runner: ns.sqlinject, alreadyRan: server.sqlPortOpen },
        { file: "FTPCrack.exe", runner: ns.ftpcrack, alreadyRan: server.ftpPortOpen },
        { file: "HTTPWorm.exe", runner: ns.httpworm, alreadyRan: server.httpPortOpen },
    ]
}

function openPorts(ns: NS, host: string): void {
    getExecutables(ns, ns.getServer(host))
        .filter(executable => !executable.alreadyRan)
        .filter(executable => ns.fileExists(executable.file, "home"))
        .forEach(executable => executable.runner(host));
}

function getServerInfo(ns: NS, name: string): ServerInfo {
    return {
        name,
        open: ns.getServer(name).openPortCount,
        required: ns.getServerNumPortsRequired(name),
    };
}

export async function main(ns: NS) {
    ns.disableLog("ALL");
    
    const hosts = getHosts(ns);

    while (hosts.some(host => !ns.getServer(host).hasAdminRights)) {
        const serversToHack = hosts.filter(host => !ns.getServer(host).hasAdminRights);

        serversToHack.forEach(server => openPorts(ns, server));
        serversToHack.map(name => getServerInfo(ns, name))
            .filter(server => server.open >= server.required)
            .forEach(server => ns.nuke(server.name));

        await ns.sleep(1000);
    }
}