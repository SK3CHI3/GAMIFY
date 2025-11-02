interface IntaSendEventHandlers {
  on(event: 'COMPLETE', handler: (results: any) => void): this
  on(event: 'FAILED', handler: (results: any) => void): this
  on(event: 'IN-PROGRESS', handler: (results?: any) => void): this
}

interface IntaSendConfig {
  publicAPIKey: string
  live: boolean
}

interface IntaSend extends IntaSendEventHandlers {
  constructor(config: IntaSendConfig): IntaSend
}

declare global {
  interface Window {
    IntaSend: new (config: IntaSendConfig) => IntaSend
  }
}

export {}

