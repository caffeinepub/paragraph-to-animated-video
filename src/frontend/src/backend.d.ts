import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Project {
    title: string;
    text: string;
}
export interface backendInterface {
    getAllProjects(): Promise<Array<Project>>;
    getProject(title: string): Promise<Project>;
    saveProject(title: string, text: string): Promise<void>;
}
