export interface CodeTheme {
    name: string;
    value: string;
    background: string;
    color: string;
}

export interface BackgroundOption {
    name: string;
    value: string;
    gradient: string;
}

export interface CodeSettings {
    theme: string;
    background: string;
    padding: number;
    showLineNumbers: boolean;
    showWindowControls: boolean;
    language: string;
    fontFamily: string;
    fontSize: number;
}
