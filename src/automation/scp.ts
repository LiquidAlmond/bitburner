import { NS } from "bitburner";
import { getHosts } from "util/get-hosts";

const files: string[] = [
    "hack.js",
];

export async function main(ns: NS) {
    ns.disableLog("ALL");

    const transferFiles = ns.args as string[];
    const hosts = getHosts(ns);

    for (let i = 0; i < hosts.length; i++) {
        const host = hosts[i];
        await ns.scp(transferFiles?.length > 0 ? transferFiles : files, "home", host);
    }
}