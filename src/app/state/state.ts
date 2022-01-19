import { Host } from "lib/state/host";
import { Operation } from "lib/operation/operation";
import { Utility } from "app/state/utility";

export const defaultState: AppState = {
    enabled: [],
    usableHosts: [],
    utilities: [],
    hacking: {
        goal: "Money",
        target: Host.JOESGUNS,
        processes: [],
        files: [
            "/app/script/hack.js",
            "/app/script/grow.js",
            "/app/script/weaken.js",
        ],
    },
    hacknet: {
        nodes: [],
    },
    inGang: false,
};

export interface AppState {
    enabled: Operation[];
    utilities: Utility[];
    usableHosts: Server[];
    hacking: Hacking;
    hacknet: Hacknet;
    inGang: boolean;
}

export interface Hacking {
    goal: "XP" | "Money";
    processes: HackProcess[];
    files: string[];
    target: Host;
}

export interface Server {
    name: Host;
    ram: number;
    hasAdmin: boolean;
    requiredPorts: number;
    openPorts: Utility[];
    hasScripts: boolean;
}

export interface HackProcess {
    id: number;
    type: "grow" | "hack" | "weaken";
    threads: number;
    target: Host;
}

export interface Hacknet {
    nodes: HacknetNode[];
}

export interface HacknetNode {
    id: number;
    level: number;
    ram: number;
    cores: number;
}