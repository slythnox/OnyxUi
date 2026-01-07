export interface IconSettings {
    size: number;
    strokeWidth: number;
    color: string;
    backgroundColor: string;
    backgroundType: 'none' | 'solid' | 'gradient';
    gradientFrom: string;
    gradientTo: string;
    padding: number;
    borderRadius: number;
}

export interface IconCategory {
    name: string;
    icons: string[];
}
