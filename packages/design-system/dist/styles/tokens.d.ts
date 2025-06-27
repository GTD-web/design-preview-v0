export type ShadcnTokenVersion = 'v0';
export interface TokenConfig {
    version: ShadcnTokenVersion;
    cssFile: string;
    description: string;
    features: string[];
}
export declare const SHADCN_TOKEN_CONFIGS: Record<ShadcnTokenVersion, TokenConfig>;
/**
 * 지정된 버전의 shadcn 토큰 CSS 파일 경로를 반환합니다.
 */
export declare function getShadcnTokenPath(version: ShadcnTokenVersion): string;
/**
 * 사용 가능한 모든 shadcn 토큰 버전을 반환합니다.
 */
export declare function getAvailableTokenVersions(): TokenConfig[];
/**
 * 특정 버전의 토큰 설정을 반환합니다.
 */
export declare function getTokenConfig(version: ShadcnTokenVersion): TokenConfig;
