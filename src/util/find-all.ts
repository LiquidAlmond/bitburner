import { NS } from 'bitburner';
import { Host } from 'lib/state/host';

const ignoredHosts = [
    Host.HOME,
    Host.DARKWEB,
]

export async function main(ns: NS) {
    ns.disableLog("ALL");

    const mask = ns.args[0] as string;

    const hosts = Object.values(Host)
        .filter(host => !ignoredHosts.includes(host))
        .filter(host => ns.serverExists(host))
        .map(host => ns.ls(host, mask).map(file => ({ host: host, file })))
        .reduce((list, files) => list.concat(files), []);

    ns.tprint(`Discovered files with mask "${mask}":`);
    ns.tprint(hosts.map(file => `{ host: ${file.host}, file: ${file.file} }`).join('\n'));
}