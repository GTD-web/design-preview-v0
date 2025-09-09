/**
 * Tab Instance Hook
 *
 * 동일한 페이지의 여러 탭 인스턴스가 독립적인 상태를 유지할 수 있게 해주는 Hook
 * tab-id 쿼리 파라미터를 통해 각 탭 인스턴스를 고유하게 식별합니다.
 */
/**
 * 탭 인스턴스별 독립적인 상태를 관리하는 Hook
 *
 * @param initialState 초기 상태값
 * @param stateKey 상태를 구분하는 키 (선택적, 기본값: 'default')
 * @returns [state, setState, tabId, instanceKey]
 */
export declare function useTabInstance<T = any>(initialState: T, stateKey?: string): [T, (newState: T | ((prevState: T) => T)) => void, string | null, string];
/**
 * 탭 인스턴스별 로컬 스토리지를 관리하는 Hook
 *
 * @param key 로컬 스토리지 키
 * @param initialValue 초기값
 * @returns [value, setValue, tabId, instanceKey]
 */
export declare function useTabInstanceLocalStorage<T = any>(key: string, initialValue: T): [T, (value: T) => void, string | null, string];
/**
 * 현재 탭의 정보를 가져오는 Hook
 *
 * @returns { tabId, instanceKey, isUniqueTab, basePath }
 */
export declare function useCurrentTabInfo(): {
    tabId: string;
    instanceKey: string;
    isUniqueTab: boolean;
    basePath: string;
    fullPath: string;
};
