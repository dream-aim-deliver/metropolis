import { BaseColor as BaseColor } from "@/lib/common/theme";

export interface ColorViewModel {
    name: string;
    h: number;
    s: number;
    b: number;
}
export const Color = ({
    name = 'color',
    h = 0,
    s = 0,
    b = 0,
}: ColorViewModel) => {
    const color = new BaseColor(name, h, s, b);
    const backgroundColor = color.toHex();
    return (
        <div
            className="flex box-border h-48 w-48 p-4 border-2 items-center justify-between"
            style={{ backgroundColor: backgroundColor }}
        >
            <div className="text-slate-800 self-start">{name}</div>
            <div className="text-slate-800 self-end">{backgroundColor}</div>
        </div>
    );
};