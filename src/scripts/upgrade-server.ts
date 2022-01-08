import { NS } from 'bitburner';

/**
 * @param {NS} ns
 * @return {{name: String, maxRam: Number}[]}
 **/
 function getPersonalServers(ns: NS): { name: string, maxRam: number}[] {
	return ns.getPurchasedServers()
		.map(name => ({
			name,
			maxRam: ns.getServerMaxRam(name),
		}));
}

/**
 * @param {NS} ns
 * @param {Number} amount
 **/
async function waitForFunds(ns: NS, amount: number): Promise<void> {
	while (amount > ns.getServerMoneyAvailable("home")) {
		await ns.sleep(1000);
	}
}

/** @param {NS} ns **/
export async function main(ns: NS) {
	const target = ns.args[0] as string;
	const targetRam = ns.args[1] as number;

	let servers = getPersonalServers(ns);
	
	while(servers.some(server => server.maxRam < targetRam)) {
		const upgradeTarget = servers.find(server => server.maxRam < targetRam);

		await waitForFunds(ns, ns.getPurchasedServerCost(targetRam));
		ns.killall(upgradeTarget.name);
		ns.deleteServer(upgradeTarget.name);
		ns.purchaseServer(upgradeTarget.name, targetRam);
		
		await ns.scp("hack.js", "home", upgradeTarget.name);
		await ns.scp("/lib/util/target.js", "home", upgradeTarget.name);
		
		const threads = Math.floor(ns.getServerMaxRam(upgradeTarget.name) / ns.getScriptRam("hack.js", upgradeTarget.name));
		ns.exec("hack.js", upgradeTarget.name, threads, target);

		await ns.sleep(100);

		servers = getPersonalServers(ns);
	}
}