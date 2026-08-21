// Minimal ImportMeta augmentation so use-auth.ts can reference import.meta.env.BASE_URL
// without a hard dependency on vite/client in this shared lib package.
interface ImportMetaEnv {
  readonly BASE_URL: string;
  [key: string]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
