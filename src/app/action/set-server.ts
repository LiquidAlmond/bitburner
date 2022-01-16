import { Host } from "lib/state/host";
import { AppState } from "app/state/state";
import { Utility } from "app/state/utility";
import { NS } from "bitburner";

export async function main(ns: NS) {
    const stateFile = ns.args[0] as string;
    const host = ns.args[1] as Host;

    let state = JSON.parse(ns.read(stateFile)) as AppState;
    state.usableHosts = state.usableHosts.filter(h => h.name !== host);
    if (ns.serverExists(host)) {
        const server = ns.getServer(host);
        state.usableHosts.push({
            name: host,
            ram: ns.getServerMaxRam(host),
            hasAdmin: server.hasAdminRights,
            requiredPorts: server.numOpenPortsRequired,
            hasScripts: state.hacking.files.every(file => ns.fileExists(file, host)),
            openPorts: [
                server.sshPortOpen ? Utility.SSH : undefined,
                server.ftpPortOpen ? Utility.FTP : undefined,
                server.smtpPortOpen ? Utility.SMTP : undefined,
                server.httpPortOpen ? Utility.HTTP : undefined,
                server.sqlPortOpen ? Utility.SQL : undefined,
            ].filter(p => p !== undefined)
        });
    }
    await ns.write(stateFile, [JSON.stringify(state)], "w");
}