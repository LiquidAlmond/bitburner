import { NS } from "bitburner";
import { Host } from "lib/state/host";

const ignoredHosts = [
    Host.HOME,
    Host.DARKWEB,
]

export async function main(ns: NS) {
    Object.values(Host)
        .filter(host => !ignoredHosts.includes(host))
        .filter(host => ns.serverExists(host))
        .forEach(host =>
            ns.ls(host, ".js").forEach(file =>
                ns.rm(file, host)
            )
        );
}