import { NS } from 'bitburner';

/** @param {NS} ns **/
export async function main(ns: NS) {
	const target = ns.args[0] as string;
	const ram = ns.args[1] as number ?? 8;

    while (ns.getPurchasedServers().length < ns.getPurchasedServerLimit()) {
		if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
			const hostname = ns.purchaseServer("pserv-" + ns.getPurchasedServers().length, ram);
			await ns.scp("hack.js", "home", hostname);
			await ns.scp("/lib/util/target.js", "home", hostname);
			const threads = Math.floor(ns.getServerMaxRam(hostname) / ns.getScriptRam("hack.js", hostname));
			ns.exec("hack.js", hostname, threads, target);
		}
		await ns.sleep(100);
	}
}