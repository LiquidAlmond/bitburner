export enum Host {
    HOME = "home",
    DARKWEB = "darkweb",
    IRON_GYM = "iron-gym",
    HARAKIRI_SUSHI = "harakiri-sushi",
    ZERO = "zer0",
    HONG_FANG_TEA = "hong-fang-tea",
    JOESGUNS = "joesguns",
    SIGMA_COSMETICS = "sigma-cosmetics",
    MAX_HARDWARE = "max-hardware",
    NEO_NET = "neo-net",
    AVMNITE_02H = "avmnite-02h",
    SUMMIT_UNI = "summit-uni",
    LEXO_CORP = "lexo-corp",
    GLOBAL_PHARM = "global-pharm",
    DELTAONE = "deltaone",
    ZEUS_MED = "zeus-med",
	NOVA_MED = "nova-med",
	TITAN_LABS = "titan-labs",
	TAIYANG_DIGITAL = "taiyang-digital",
	RUN4THEH111Z = "run4theh111z",
	MICRODYNE = "microdyne",
	STORMTECH = "stormtech",
	DEFCOMM = "defcomm",
	NECTAR_NET = "nectar-net",
	OMEGA_NET  ="omega-net",
	THE_HUB = "the-hub",
	PHANTASY = "phantasy",
	CRUSH_FITNESS = "crush-fitness",
	COMPTEK = "comptek",
	CATALYST = "catalyst",
	RHO_CONSTRUCTION = "rho-construction",
	SYSCORE = "syscore",
	MILLENIUM_FITNESS = "millenium-fitness",
	GALACTIC_CYBER = "galactic-cyber",
	UNITALIFE = "unitalife",
	UNIV_ENERGY = "univ-energy",
	ZB_DEF = "zb-def",
	INFOCOMM = "infocomm",
	APPLIED_ENERGISTICS = "applied-energetics",
	VITALIFE = "vitalife",
	KUAI_GONG = "kuai-gong",
	FOUR_SIGMA = "4sigma",
	CLARKINC = "clarkinc",
	THE_CAVE = "The-Cave",
	WORLD_DAEMON = "w0r1d_d43m0n",
	FULCRUMASSETS = "fulcrumassets",
	HELIOS = "helios",
	OMNITEK = "omnitek",
	B_AND_A = "b-and-a",
	FULCRUMTECH = "fulcrumtech",
	DOT = ".",
	POWERHOUSE_FITNESS = "powerhouse-fitness",
	NWO = "nwo",
	MEGACORP = "megacorp",
	ECORP = "ecorp",
	BLADE = "blade",
	SILVER_HELIX = "silver-helix",
	JOHNSON_ORTHO = "johnson-ortho",
	IIII = "I.I.I.I",
	ROTHMAN_UNI = "rothman-uni",
	AUVEM_POLICE = "aevum-police",
	ALPHA_ENT = "alpha-ent",
	SNAP_FITNESS = "snap-fitness",
	AEROCORP = "aerocorp",
	OMNIA = "omnia",
	SOLARIS = "solaris",
	ICARUS = "icarus",
	NETLINK = "netlink",
	ZB_INSTITUTE = "zb-institute",
	FOODNSTUFF = "foodnstuff",
	NOODLES = "n00dles",
	CSEC = "CSEC",

	PSERV_0 = "pserv-0",
	PSERV_1 = "pserv-1",
	PSERV_2 = "pserv-2",
	PSERV_3 = "pserv-3",
	PSERV_4 = "pserv-4",
	PSERV_5 = "pserv-5",
	PSERV_6 = "pserv-6",
	PSERV_7 = "pserv-7",
	PSERV_8 = "pserv-8",
	PSERV_9 = "pserv-9",
	PSERV_10 = "pserv-10",
	PSERV_11 = "pserv-11",
	PSERV_12 = "pserv-12",
	PSERV_13 = "pserv-13",
	PSERV_14 = "pserv-14",
	PSERV_15 = "pserv-15",
	PSERV_16 = "pserv-16",
	PSERV_17 = "pserv-17",
	PSERV_18 = "pserv-18",
	PSERV_19 = "pserv-19",
	PSERV_20 = "pserv-20",
	PSERV_21 = "pserv-21",
	PSERV_22 = "pserv-22",
	PSERV_23 = "pserv-23",
	PSERV_24 = "pserv-24",
}

export const PurchasedHosts: Host[] = Object.values(Host).filter(host => host.startsWith("pserv"));