export type ShadcnTokenVersion = 'v0';

export interface TokenConfig {
  version: ShadcnTokenVersion;
  cssFile: string;
  description: string;
  features: string[];
}

export const SHADCN_TOKEN_CONFIGS: Record<ShadcnTokenVersion, TokenConfig> = {
  v0: {
    version: 'v0',
    cssFile: 'shadcn-tokens-v0.css',
    description: 'Original shadcn token system with neutral color palette (oklch based)',
    features: [
      'oklch color system',
      'Light/Dark mode support',
      'Standard radius values',
      'Chart color variables',
      'Sidebar tokens'
    ]
  }
};

/**
 * 지정된 버전의 shadcn 토큰 CSS 파일 경로를 반환합니다.
 */
export function getShadcnTokenPath(version: ShadcnTokenVersion): string {
  return `@lumir-company/design-system-v0/styles/${SHADCN_TOKEN_CONFIGS[version].cssFile}`;
}

/**
 * 사용 가능한 모든 shadcn 토큰 버전을 반환합니다.
 */
export function getAvailableTokenVersions(): TokenConfig[] {
  return Object.values(SHADCN_TOKEN_CONFIGS);
}

/**
 * 특정 버전의 토큰 설정을 반환합니다.
 */
export function getTokenConfig(version: ShadcnTokenVersion): TokenConfig {
  return SHADCN_TOKEN_CONFIGS[version];
} 