// Error personalizado para la aplicación OSS
export class OssError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'OssError';
  }
}