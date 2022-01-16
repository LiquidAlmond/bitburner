import { GangGenInfo, GangMemberInfo, NS } from "bitburner";

export async function main(ns: NS) {
    ns.disableLog("ALL");

    while (!ns.gang.inGang()) {
        await ns.sleep(10000);
    }

	while (true) {
        for (let i = 0; i < 75; i++) {
            recruitAll(ns);
            ns.gang.getMemberNames().forEach(name => {
                buyAllEquipment(ns, name);
                assignAction(ns, name);
            });
            await ns.sleep(4000);
        }
        ascendStrongest(ns);
	}
}

const gangActions: GangAction[] = [
    {
        action: "Train Combat",
        predicate: (info) => info.member.str < 150,
    },
    {
        action: "Terrorism",
        predicate: (info) => info.member.str > 150 && Math.random() < 0.2,
    },
    {
        action: "Territory Warfare",
        predicate: (info) => info.member.str > 300 && Math.random() < 0.4,
    },
    {
        action: "Vigilante Justice",
        predicate: (info) => info.gang.wantedPenalty < 0.9 && info.gang.wantedLevel > 1.1,
    },
    {
        action: "Strongarm Civilians",
        predicate: (info) => info.member.str < 500,
    },
    {
        action: "Traffick Illegal Arms",
        predicate: () => true,
    },
];

function recruitAll(ns: NS): void {
    while (ns.gang.canRecruitMember()) {
        ns.gang.recruitMember(`Member-${ns.gang.getMemberNames().length + 1}`);
    }
}

function buyAllEquipment(ns: NS, name: string): void {
    ns.gang.getEquipmentNames()
        .filter(item => !ns.gang.getMemberInformation(name).upgrades.includes(item))
        .filter(item => ns.gang.getEquipmentCost(item) < ns.getServerMoneyAvailable("home"))
        .forEach(item => ns.gang.purchaseEquipment(name, item));
}

function assignAction(ns: NS, name: string): void {
    const member = ns.gang.getMemberInformation(name);
    const gang = ns.gang.getGangInformation();
    const action = gangActions.find(rule => rule.predicate({ member, gang }));
    ns.gang.setMemberTask(name, action.action);
}

function getStrongestMember(ns: NS): string | undefined {
    return ns.gang.getMemberNames()
        .map(name => ({ name, info: ns.gang.getMemberInformation(name), ascension: ns.gang.getAscensionResult(name) }))
        .map(member => ({ name: member.name, gains: {
            str: (member.ascension?.str ?? 0) / member.info.str_asc_mult,
            def: (member.ascension?.def ?? 0) / member.info.def_asc_mult,
            dex: (member.ascension?.dex ?? 0) / member.info.dex_asc_mult,
            agi: (member.ascension?.agi ?? 0) / member.info.agi_asc_mult,
        }}))
        .map(member => ({ name: member.name, avgGain: Object.values(member.gains).reduce((sum, stat) => sum + stat, 0) / 4}))
        .filter(member => member.avgGain > 1.1)
        .sort((a,b) => b.avgGain - a.avgGain)
        .find(() => true)
        ?.name;
}

function ascendStrongest(ns: NS): void {
    const member = getStrongestMember(ns);
    ns.print(typeof member === "string" ? `Ascending ${member}.` : `No member strong enough to ascend.`);
    if (typeof member === "string") {
        ns.gang.ascendMember(member);
    }
}

interface GangActionDiscriminant {
    member: GangMemberInfo;
    gang: GangGenInfo;
}

interface GangAction {
    action: string;
    predicate: (info: GangActionDiscriminant) => boolean;
}