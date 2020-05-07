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

export function sameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() == date2.getFullYear() && 
        date1.getMonth() == date2.getMonth() && 
        date1.getDate() == date2.getDate();
}