function ErrorFactory (name) {
  return class BusinessError extends Error {
    constructor (message) {
      super(message)
      this.name = name
    }
  }
}

export const NoData = ErrorFactory('There is no data')
export const NotFoundUser = ErrorFactory('User not found')
export const DuplicateInfo = ErrorFactory('Existing information')
export const DocumentInUse = ErrorFactory('Document is in use')
export const AccountAlreadyDisable = ErrorFactory('User is disable')
export const ActionNotAllowed = ErrorFactory('Action no allowed')
export const NoInsert = ErrorFactory('No insert')
export const InfoAlreadyExisting = ErrorFactory('The information already exists')
