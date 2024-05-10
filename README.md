# FastFeet
## Delivery services

### Functional Requirements
- [] There should be two possible roles for an user, delivery person or admin
- [] It should be able to logon with CPF ans a password
- [] It should be able to perform CRUD actions over delivery people
- [] It should be able to perform CRUD actions over packages
- [] It should be able to perform CRUD actions over addressees
- [] It should be able to mark a package as avaliable for taking
- [] It should be able to take a package for delivery
- [] It should be able to mark a package as delivered
- [] It should be able to mark a package as returned
- [] It should be able to list packages addressed to locations nearby the delivery person's
- [] It should be able to change an user's password
- [] It should be able to list an user's packages
- [] It should notify the addressee whenever a package has its status updated

### Non-Functional Requirements
- [] User's password should be encrypted in database
- [] Authentication should use JWT strategy

### Business Rules
- [] Only admin users can perform CRUD actions over packages
- [] Only admin users can perform CRUD actions over delivery people
- [] Only admin users can perform CRUD actions over addressees
- [] In order to mark a package as delivered, a photo of it should be sent
- [] Only the delivery person who took the package can mark it as delivered
- [] Only an admin can alter an user's password
- [] It shouldn't be able for a delivery person to list another's packages
