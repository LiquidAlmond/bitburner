import { GangGenInfo, GangMemberInfo, NS } from "bitburner";

export async function main(ns: NS) {
    ns.disableLog("ALL");
    
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
        action: "Terrorism",
        predicate: () => Math.random() < 0.2,
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
        action: "Mug People",
        predicate: (info) => info.member.str < 150,
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

function getStrongestMember(ns: NS): string {
    return ns.gang.getMemberNames()
        .map(name => ns.gang.getMemberInformation(name))
        .map(member => ({ member, ascension: {
            str: ns.gang.getAscensionResult(member.name).str / member.str_asc_mult,
        }}))
        .sort((a,b) => b?.ascension?.str ?? 0 - a?.ascension?.str ?? 0)
        .find(() => true)
        .member.name;
}

function ascendStrongest(ns: NS): void {
    ns.gang.ascendMember(getStrongestMember(ns));
}

interface GangActionDiscriminant {
    member: GangMemberInfo;
    gang: GangGenInfo;
}

interface GangAction {
    action: string;
    predicate: (info: GangActionDiscriminant) => boolean;
}