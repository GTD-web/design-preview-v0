import React from "react";
export declare const sidebarIconOptions: {
    id: string;
    name: string;
    collapseIcon: React.JSX.Element;
    expandIcon: React.JSX.Element;
}[];
export interface SidebarIconOption {
    id: string;
    name: string;
    collapseIcon: React.ReactNode;
    expandIcon: React.ReactNode;
}
export declare function useSidebarIcons(): {
    selectedIconId: string;
    setSelectedIcon: (iconId: string) => void;
    currentIcon: {
        id: string;
        name: string;
        collapseIcon: React.JSX.Element;
        expandIcon: React.JSX.Element;
    };
    iconOptions: {
        id: string;
        name: string;
        collapseIcon: React.JSX.Element;
        expandIcon: React.JSX.Element;
    }[];
    isLoaded: boolean;
};
