function ErrorFactory (name) {
  return class BusinessError extends Error {
    constructor (message) {
      super(message)
      this.name = name
    }
  }
}

export const NoData = ErrorFactory('There is no data')
