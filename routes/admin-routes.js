const express = require('express');

const router = express.Router(); 

const adminController = require('../controller/admin-controller');

const multiFileUpload = require('../middleware/multiFile-upload');

router.get('/', (req, res, next) => {
 
  res.json({message: 'admin routes'});
});

router.post('/states/addState',multiFileUpload.fields([{
  name: 'image', maxCount: 1
}]), adminController.addState);


router.post('/states/addCity',multiFileUpload.fields([{
  name: 'image', maxCount: 1
}]), adminController.addCity );

router.get('/states', adminController.getAllStates);

router.get('/cities',adminController.getAllCities)

router.get('/state/:id/cities',adminController.getListOfCities);

router.post('/service/addService', adminController.addService);

router.get('/city/:id/services', adminController.getListofServicesByCityId)

router.get('/services', adminController.getListofServices)


router.post('/service/addServiceProvider',multiFileUpload.fields([{
  name: 'image', maxCount: 1
}]), adminController.AddServiceProvider)


router.get("/service/:id/getListOfServceProvider", adminController
.getListOfServiceProvidersByServiceId)


router.post('/auth/add',adminController.createAdmin);

router.post('/auth/login',adminController.adminLogin);

router.get('/getStatesCount', adminController.getStatesCount);

router.get('/getCitiesCount', adminController.getCitiesCount);

router.get('/getServicesCount', adminController.getServicesCount);
router.get('/getServiceProvidersCount', adminController.getServiceProvidersCount);


router.post('/slider/addImage',multiFileUpload.fields([{
  name: 'image', maxCount: 1
}]), adminController.addSliderImage);

router.get('/slider/getSliderImages' , adminController.getSliderImage);

router.delete('/slider/:bid', adminController.deleteSliderImageById);
router.delete('/service/deleteService/:bid', adminController.deleteServiceById);
router.delete('/cities/delete/:bid', adminController.deleteCitiesById);

module.exports = router;
