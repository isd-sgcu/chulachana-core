import Cookies from 'cookies'
import { IncomingMessage, ServerResponse } from 'http'
import { cookiesKey } from './env'

type Key = string | number | symbol

export type CoreConfig = {
  events: Key[]
  phone: string
}

export type EventConfig = {
  isStaff: boolean
  checkInDate: number
  checkOutDate: number
}

type Namespace<N extends Key> = N extends 'core' ? CoreConfig : EventConfig

export class Config {
  cookies: Cookies
  configMap: any = {}

  constructor(req: IncomingMessage, res: ServerResponse) {
    this.cookies = new Cookies(req, res, { keys: [cookiesKey] })
  }

  getNamespace<N extends Key>(namespace: N): Partial<Namespace<N>> {
    let conf = this.configMap[namespace] as Partial<Namespace<N>>
    if (conf === undefined) {
      const value = this.cookies.get(`config-${namespace}`, { signed: true })
      if (value !== undefined) {
        conf = JSON.parse(value)
      } else {
        conf = {}
      }
      this.configMap[namespace] = conf
    }
    if (namespace !== 'core') {
      const coreConfig = this.getNamespace('core')
      const events = coreConfig.events || []
      if (!events.includes(namespace)) {
        coreConfig.events = [...events, namespace]
        this.setNamespace('core', coreConfig)
      }
    }
    return conf
  }

  private setNamespace<N extends Key>(
    namespace: N,
    conf: Partial<Namespace<N>>
  ) {
    this.cookies.set(
      `config-${namespace}`,
      conf !== undefined ? JSON.stringify(conf) : undefined,
      { signed: true }
    )
    this.configMap[namespace] = conf
  }

  get<N extends Key, K extends keyof Namespace<N>>(
    namespace: N,
    key: K
  ): Namespace<N>[K] {
    return this.getNamespace(namespace)[key]
  }

  set<N extends Key, K extends keyof Namespace<N>>(
    namespace: N,
    key: K,
    value?: Namespace<N>[K]
  ) {
    const conf = this.getNamespace(namespace)
    if (value !== undefined) {
      conf[key] = value
    } else {
      delete conf[key]
    }
    this.setNamespace(namespace, conf)
  }
}
