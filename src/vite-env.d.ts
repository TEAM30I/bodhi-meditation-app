
/// <reference types="vite/client" />

// Allow importing data from public directory
declare module '/public/data/*' {
  const content: any;
  export = content;
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
