import { Host } from "lib/state/host";
import { AppState } from "app/state/state";
import { Utility } from "app/state/utility";
import { NS } from "bitburner";

export async function main(ns: NS) {
    const stateFile = ns.args[0] as string;

    let state = JSON.parse(ns.read(stateFile)) as AppState;
    state.usableHosts = Object.values(Host)
        .filter(host => ns.serverExists(host))
        .map(host => ({ name: host, info: ns.getServer(host) }))
        .map(server => ({
            name: server.name,
            ram: server.info.maxRam,
            hasAdmin: server.info.hasAdminRights,
            requiredPorts: server.info.numOpenPortsRequired,
            hasScripts: state.hacking.files.every(file => ns.fileExists(file, server.name)),
            openPorts: [
                server.info.sshPortOpen ? Utility.SSH : undefined,
                server.info.ftpPortOpen ? Utility.FTP : undefined,
                server.info.smtpPortOpen ? Utility.SMTP : undefined,
                server.info.httpPortOpen ? Utility.HTTP : undefined,
                server.info.sqlPortOpen ? Utility.SQL : undefined,
            ].filter(p => p !== undefined),
        }));
    await ns.write(stateFile, [JSON.stringify(state)], "w");
}