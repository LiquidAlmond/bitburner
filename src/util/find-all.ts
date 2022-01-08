import { NS } from 'bitburner';
import { getHosts } from 'util/get-hosts';

export async function main(ns: NS) {
    ns.disableLog("ALL");

    const mask = ns.args[0] as string;

    const hosts = getHosts(ns)
        .map(host => ns.ls(host, mask).map(file => ({ host: host, file })))
        .reduce((list, files) => [...list, ...files], []);

    ns.tprint(`Discovered files with mask "${mask}":`);
    ns.tprint(hosts.map(file => `{ host: ${file.host}, file: ${file.file} }`).join('\n'));
}