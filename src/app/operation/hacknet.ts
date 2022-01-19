import { Action } from 'app/state/action';
import { AppState } from 'app/state/state';
import { NS, NodeStats } from 'bitburner';
import { Operation } from 'lib/operation/operation';
import { Host } from 'lib/state/host';
import { Store } from 'lib/state/state';

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

export async function main(ns: NS) {
	ns.disableLog("ALL");

	const store = new Store<AppState>(ns);
	let state = store.state;
	let nodes = getNodes(ns);

	while (state.enabled.includes(Operation.HACKNET)) {
		const nodes = state.hacknet.nodes;
		let cash = ns.getServerMoneyAvailable(Host.HOME);

		for (let node of nodes) {
			const gain = ns.formulas.hacknetNodes.moneyGainRate(node.level, node.ram, node.cores);
			const spendLimit = Math.max(100000, gain * 3600);
			
			// compute deltas
			const levelDelta = ns.formulas.hacknetNodes.moneyGainRate(node.level + 1, node.ram, node.cores) - gain;
			const ramDelta = ns.formulas.hacknetNodes.moneyGainRate(node.level, node.ram + 1, node.cores) - gain;
			const coreDelta = ns.formulas.hacknetNodes.moneyGainRate(node.level, node.ram, node.cores + 1) - gain;
			const bestDelta = Math.max(levelDelta, ramDelta, coreDelta);
			
			if (levelDelta === bestDelta) {
				let upgrades = 1;
				while (spendLimit >= ns.formulas.hacknetNodes.levelUpgradeCost(node.level, upgrades, ns.getPlayer().hacknet_node_level_cost_mult)) upgrades++;
				if (upgrades > 1) {
					ns.hacknet.upgradeLevel(node.id, upgrades - 1);
				}
			} else if (ramDelta === bestDelta) {
				let upgrades = 1;
				while (spendLimit >= ns.formulas.hacknetNodes.ramUpgradeCost(node.level, upgrades, ns.getPlayer().hacknet_node_ram_cost_mult)) upgrades++;
				if (upgrades > 1) {
					ns.hacknet.upgradeRam(node.id, upgrades - 1);
				}
			} else {
				let upgrades = 1;
				while (spendLimit >= ns.formulas.hacknetNodes.coreUpgradeCost(node.level, upgrades, ns.getPlayer().hacknet_node_core_cost_mult)) upgrades++;
				if (upgrades > 1) {
					ns.hacknet.upgradeCore(node.id, upgrades - 1);
				}
			}
		}

		await ns.sleep(5000);
		state = store.state;
	}
}