# FastFeet
## Delivery services

### Functional Requirements
- [X] There should be two possible roles for an user, delivery person or admin
- [X] It should be able to logon with CPF and a password
- [X] It should be able to perform CRUD actions over delivery people
- [X] It should be able to perform CRUD actions over parcels
- [X] It should be able to perform CRUD actions over addressees
- [X] It should be able to mark a parcel as avaliable for taking
- [X] It should be able to take a parcel for delivery
- [X] It should be able to mark a parcel as delivered
- [X] It should be able to mark a parcel as returned
- [X] It should be able to list parcels addressed to locations nearby the delivery person's
- [X] It should be able to change an user's password
- [X] It should be able to list an user's parcels
- [X] It should notify the addressee whenever a parcel has its status updated

### Non-Functional Requirements
- [X] User's password should be encrypted in database
- [ ] Authentication should use JWT strategy

### Business Rules
- [ ] Only admin users can perform CRUD actions over parcels
- [ ] Only admin users can perform CRUD actions over delivery people
- [ ] Only admin users can perform CRUD actions over addressees
- [ ] In order to mark a parcel as delivered, a photo of it should be sent
- [X] Only the delivery person who took the parcel can mark it as delivered
- [ ] Only an admin can alter an user's password
- [X] It shouldn't be able for a delivery person to list another's parcels
