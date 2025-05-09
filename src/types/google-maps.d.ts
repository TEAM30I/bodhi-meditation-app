declare namespace google {
  namespace maps {
    class Geocoder {
      geocode(
        request: { address: string } | { location: { lat: number; lng: number } },
        callback: (
          results: google.maps.GeocoderResult[] | null,
          status: google.maps.GeocoderStatus
        ) => void
      ): void;
    }

    interface GeocoderResult {
      geometry: {
        location: {
          lat(): number;
          lng(): number;
        };
      };
    }

    enum GeocoderStatus {
      OK,
      ZERO_RESULTS,
      OVER_QUERY_LIMIT,
      REQUEST_DENIED,
      INVALID_REQUEST,
      UNKNOWN_ERROR
    }
  }
} 