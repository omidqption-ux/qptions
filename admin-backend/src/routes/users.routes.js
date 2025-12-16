import { Router } from 'express'
import * as ctrl from '../controllers/users.controller.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'
import validate from '../middlewares/validate.js'
import {
    idParams,
    usersCountInformationQuery,
    customersPerCountryQuery,
    mostProfitableQuery,
    customersCountPeriodlicallyQuery,
    verifyEmailBody,
    verifyPhoneBody
} from '../validators/users.schema.js'

const r = Router()

r.get('/list', requireAuth, requireRole('superAdmin', 'admin', 'support'), ctrl.list)
r.get('/getOne', requireAuth, requireRole('superAdmin', 'admin', 'support'), validate({ params: idParams }), ctrl.getOne)
r.post('/update', requireAuth, requireRole('superAdmin', 'admin',), ctrl.update)
r.get('/usersCountInformation', validate({ query: usersCountInformationQuery }), ctrl.usersCountInformation)
r.get('/customersPerCountry', validate({ query: customersPerCountryQuery }), ctrl.customersPerCountry)
r.get('/mostProfitableCustumersVolumeCount', validate({ query: mostProfitableQuery }), ctrl.mostProfitableCustumersVolumeCount)
r.get('/customersCountPeriodlically', validate({ query: customersCountPeriodlicallyQuery }), ctrl.customersCountPeriodlically)
r.put('/verifyUserEmail', validate({ body: verifyEmailBody }), ctrl.verifyUserEmail)
r.put('/verifyUserPhone', validate({ body: verifyPhoneBody }), ctrl.verifyUserPhone)

export default r
