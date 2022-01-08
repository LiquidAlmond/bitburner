import { NS, NodeStats } from 'bitburner';

interface HacknetNode extends NodeStats {
	index: number;
	cost: {
		[key: string]: number;
		level: number;
		ram: number;
		core: number;
	};
}

interface Upgrade {
	index: number;
    type: string;
    cost: number;
}

function getNodes(ns: NS): HacknetNode[] {
	return new Array(ns.hacknet.numNodes())
		.fill(undefined)
		.map((_, index) => ns.hacknet.getNodeStats(index))
		.map((node, index) => ({
			...node,
			index,
			cost: {
				level: ns.hacknet.getLevelUpgradeCost(index, 1),
				ram: ns.hacknet.getRamUpgradeCost(index, 1),
				core: ns.hacknet.getCoreUpgradeCost(index, 1),
			},
		}));
}

function upgradeAvailable(ns: NS, nodes: HacknetNode[]): boolean {
	return ns.hacknet.numNodes() < ns.hacknet.maxNumNodes() ||
		nodes.some(node => node.level < 200 || node.ram < 7 || node.cores < 16 );
}

function minimumCostType(node: HacknetNode): string {
	return Object.keys(node.cost)
		.reduce((min, key) => node.cost[key] < node.cost[min] ? key : min, "level");
}

function getUpgraders(ns: NS) {
	return {
		level: ns.hacknet.upgradeLevel,
		ram: ns.hacknet.upgradeRam,
		core: ns.hacknet.upgradeCore,
	};
}

function getCheapestUpgradeOnNode(node: HacknetNode): Upgrade {
	return {
		index: node.index,
		type: minimumCostType(node),
		cost: node.cost[minimumCostType(node) as keyof typeof node.cost],
	};
}

const unknownUpgrade: Upgrade = {
	index: -1,
	type: undefined,
	cost: Infinity,
}

function getCheapestUpgrade(ns: NS, nodes: HacknetNode[]): Upgrade {
	return nodes.map(node => getCheapestUpgradeOnNode(node))
		.reduce((min, upgrade) => upgrade.cost < min.cost ? upgrade : min, unknownUpgrade);
}

async function purchaseNewNode(ns: NS, cost: number): Promise<void> {
	ns.print(`Purchasing new server for ${cost}`)
	while (cost > ns.getServerMoneyAvailable("home")) {
		await ns.sleep(1000);
	}
	ns.hacknet.purchaseNode();
}

async function upgradeNode(ns: NS, upgrade: Upgrade): Promise<void> {
	ns.print(`Upgrading ${upgrade.type} on node ${upgrade.index} for ${upgrade.cost}`)
	while (upgrade.cost > ns.getServerMoneyAvailable("home")) {
		await ns.sleep(1000);
	}
	const upgraders = getUpgraders(ns);
	upgraders[upgrade.type as keyof typeof upgraders](upgrade.index, 1);
}

/** @param {NS} ns **/
export async function main(ns: NS) {
	ns.disableLog("ALL");

	let nodes = getNodes(ns);

	while (upgradeAvailable(ns, nodes)) {
		const cheapestUpgrade = getCheapestUpgrade(ns, nodes);
		const newNodeCost = ns.hacknet.getPurchaseNodeCost();

		if (newNodeCost <= cheapestUpgrade.cost) {
			purchaseNewNode(ns, newNodeCost);
		} else {
			upgradeNode(ns, cheapestUpgrade);
		}

		await ns.sleep(100);
		nodes = getNodes(ns);
	}
}