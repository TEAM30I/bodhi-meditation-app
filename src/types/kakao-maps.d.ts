declare global {
  interface Window {
    kakao: {
      maps: {
        services: {
          Geocoder: new () => {
            addressSearch: (
              address: string,
              callback: (
                result: Array<{
                  x: string;
                  y: string;
                }>,
                status: any
              ) => void
            ) => void;
          };
          Status: {
            OK: string;
            ZERO_RESULT: string;
            ERROR: string;
          };
        };
      };
    };
  }
}

export {}; 