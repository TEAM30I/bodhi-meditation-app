/**
 * 타입 안전하게 데이터를 변환하는 유틸리티 함수
 * @param data 변환할 데이터
 * @returns 타입이 지정된 데이터
 */
export function typedData<T>(data: any): T {
    return data as T;
  }