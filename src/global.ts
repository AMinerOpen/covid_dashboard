import { WrappedComponentProps } from "react-intl";
import { ITimeline, IEpidemicData } from "./models";

export interface IEnv {
    lang: "zh" | "en";
    isMobile: boolean;
    date: Date;
    speed: number;
}

export interface IDefaultProps {
    env: IEnv;
    epData?: {[id: string]: ITimeline<IEpidemicData>}
    transData?: {[id: string]: {[lang: string]: string}}
}