
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const State = require('../models/states-schema')
const City = require('../models/city-schema')
const Service = require('../models/service-schema')
const ServiceProvider = require('../models/serviceprovider-schema')
const Admin = require('../models/admin-login');

const Slider = require('../models/slider-schema');

let geoip = require('geoip-lite');

const mongoose = require('mongoose');

const HttpError = require('../middleware/http-error');

const { v1: uuid } = require('uuid');


const addState = async (req ,res, next) => {
 
    const { title, description  , listOfCities } = req.body;
    let SingleFilePath ;
    let imgPath ;
    let cityArr = []
    let existingState
    try{
         existingState = await State.findOne({ title : title })
    }
    catch(err){
        const error = await new HttpError("something went wrong,creating a state failed",500)
        return next(error)
    }
    if(existingState){
        const error = new HttpError("state already exists",422)
        return next(error)
    }


    const fileSingle = req.files.image;

    console.log(fileSingle)

    if(!fileSingle){
        const error = new Error("please single choose files");
        return next(error)
      }
      
      fileSingle.forEach(img => {
        console.log(img.path)
         imgPath = img.path;
         SingleFilePath = imgPath
      })


      cityArr = listOfCities.split(',')
    
   const createdState = new State ({
    title,
    description,
    image:SingleFilePath,
    listOfCities:cityArr
   })
  console.log(req.files.path)
   try {
    createdState.save()
   }
   catch(err) {
    console.log(errors);
    const error =  new HttpError("invalid input are passed,please pass valid data",422)
    return next(error)
   }
     
   res.status(201).json({ state : createdState });


}



const addCity = async (req ,res, next) => {
 
    const { title, description , stateId } = req.body;
    let SingleFilePath ;
    let imgPath ;

    let existingCity
    try{
         existingCity = await City.findOne({ title : title })
    }
    catch(err){
        const error = await new HttpError("something went wrong,creating a state failed",500)
        return next(error)
    }
    if(existingCity){
        const error = new HttpError("city already exists",422)
        return next(error)
    }


    let existingState
    try{
         existingState = await State.findById(`${stateId}`)

    }
    catch(err){
        const error = await new HttpError("something went wrong,finding state failed",500)
        return next(error)
    }
    if(!existingState){
        const error = new HttpError("State doesnt exists",400)
        return next(error)
    }

    

    const fileSingle = req.files.image;

    console.log(fileSingle)

    if(!fileSingle){
        const error = new Error("please single choose files");
        return next(error)
      }
      
      fileSingle.forEach(img => {
        console.log(img.path)
         imgPath = img.path;
         SingleFilePath = imgPath
      })


    
   const createdCity = new City ({
    title,
    description,
    stateId,
    image:SingleFilePath,
   })
  console.log(req.files.path)
 

  if(existingState){
    try {
     const sess = await mongoose.startSession();
     sess.startTransaction();
     await createdCity.save({ session: sess });
     existingState.cities.push(createdCity);
     await existingState.save({ session: sess });
     await sess.commitTransaction();
  
   } catch (err) {
       console.log(err)
     const error = new HttpError(
       'Creating city failed, please try again.',
       500
     );
     return next(error);
   }
 
   }

     
   res.status(201).json({ city : createdCity , state : existingState  });


}


const getAllStates = async(req ,res, next)=> {

    let allStates;
    try {
       allStates = await State.find({ })
       if (!allStates || allStates.length === 0) {
        return next(
          new HttpError('there are no States ', 404)
        );
      }
    }
    catch(err){
        const error = new HttpError("fetching states data failed ",500)
        return next(error)
    }
    res.json({ states : allStates })
}


const getAllCities = async(req ,res, next)=> {

    let allCities;
    try {
       allCities = await City.find({ })
       if (!allCities || allCities.length === 0) {
        return next(
          new HttpError('there are no cities', 404)
        );
      }
    }
    catch(err){
        const error = new HttpError("fetching cities data failed ",500)
        return next(error)
    }
    res.json({ cities : allCities })
}

const getListOfCities = async(req, res, next) => {
     
  const StateFoundId = req.params.id;

    let stateId;
     try{

      stateId = await City.find({stateId : StateFoundId})

     }catch (err) {
       const error = new HttpError("cities list not found")
     }

    res.json({ message : " list of cities ", cities : stateId})
    
}


const addService = async (req ,res, next) => {
  const { serviceValue, serviceLabel  , options  , cityId , stateId } = req.body;
 
 console.log(serviceValue)
  let existingService
  try{
       existingService = await Service.findOne({ serviceValue : serviceValue })
  }
  catch(err){
    console.log("service error",err)
      const error = await new HttpError("something went wrong,creating a service failed",500)
      return next(error)
  }
  if(existingService){
      const error = new HttpError("service already exists",422)
      return next(error)
  }
   console.log("state id", stateId)
  let findCity;
 try {
    findCity = await City.findById(cityId)
 }
 catch(err){
   console.log("city",err)
   const error = new HttpError("City Not Found")
   return next(error)
 }
 let servicesArr =[]
  servicesArr = options.split(',')

 const createdService = new Service ({
  serviceValue,
  serviceLabel,
  options :servicesArr,
  cityId,
  stateId,
  categoryId : uuid()
 })



 if(findCity){
  try {
   const sess = await mongoose.startSession();
   sess.startTransaction();
   await createdService.save({ session: sess });
   findCity.services.push(createdService);
   await findCity.save({ session: sess });
   await sess.commitTransaction();

 } catch (err) {
     console.log(err)
   const error = new HttpError(
     'Creating service failed, please try again.',
     500
   );
   return next(error);
 }

 }
 console.log("hello world ",createdService)

 res.status(201).json({ service : createdService });


}

const getListofServices = async (req ,res, next) => {

  let services;
  try{

   services = await Service.find({ })

  }catch (err) {
    const error = new HttpError("Services list not found")
  }

 res.json({ message : " list of Services ", services : services})
 

}

const getListofServicesByCityId = async (req , res , next)=> {
  const StateFoundId = req.params.id;

  let listOfServices;
  try {
    listOfServices = await City.findById(StateFoundId).populate('services');
  } catch (err) {
    const error = new HttpError(
      'Fetching services failed, please try again later',
      500
    );
    return next(error);
  }
  // if (!service || service.length === 0) {
  if (!listOfServices || listOfServices.services.length === 0) {
    return next(
      new HttpError('Could not find services for the provided  id.', 404)
    );
  }
  res.json({
    services: listOfServices.services.map(service =>
      service.toObject({ getters: true })
    )
  });
}

const AddServiceProvider = async(req ,res ,next) => {
  const { name ,serviceId, categoryId ,profession, address , contactNumber , whatsAppNumber , gmailId , facebookId , instagramId , state , city , pincode} = req.body ;

  let SingleFilePath;

  const fileSingle = req.files.image;

  console.log(fileSingle)


   let foundService ;

   try {
     foundService = await Service.findById(serviceId)
   }
   catch(err){
     console.log(err)
     const error = new HttpError("service not found")
     return next(error)
   }

   if(!foundService){
    const error = new HttpError("service not found")
    return next(error)
   }
 
  if(!fileSingle){
      const error = new Error("please single choose files");
      return next(error)
    }
    
    fileSingle.forEach(img => {
      console.log(img.path)
       imgPath = img.path;
       SingleFilePath = imgPath
    })


  const createdServiceProvider = new ServiceProvider({
    name,
    image : SingleFilePath,
    profession,
    address,
    contactNumber,
    whatsAppNumber,
    gmailId,
    facebookId,
    instagramId,
    state,
    city,
    pincode,
    serviceId

  })

  console.log("Created Service",createdServiceProvider)

  try{
    createdServiceProvider.save()
  }
  catch(err){
    console.log(error)
    const error = new HttpError(
      'adding service provider failed, please try again.',
      500
    );
  }

console.log("dogg",foundService)


  if(foundService){
    try {
     const sess = await mongoose.startSession();
     sess.startTransaction();
     foundService.serviceproviders.push(createdServiceProvider);
     await foundService.save({ session: sess });
     await sess.commitTransaction();
  
   } catch (err) {
       console.log(err)
     const error = new HttpError(
       'adding service provider failed session, please try again.',
       500
     );
     return next(error);
   }
 
   }

     
res.json({ mesage : "creted service successfully ",serviceProvide : createdServiceProvider})

}

const getListOfServiceProvidersByServiceId = async (req, res , next)=> {
  const serviceId = req.params.id;

  let listOfServiceProviders;
  try {
    listOfServiceProviders = await Service.findById(serviceId).populate('serviceproviders');
  } catch (err) {
    const error = new HttpError(
      'Fetching services failed, please try again later',
      500
    );
    return next(error);
  }

console.log(listOfServiceProviders)

  // if (!service || service.length === 0) {
  if (!listOfServiceProviders || listOfServiceProviders.serviceproviders.length === 0) {
    return next(
      new HttpError('Could not find services for the provided  id.', 404)
    );
  }
  res.json({
    services: listOfServiceProviders.serviceproviders.map(sp =>
      sp.toObject({ getters: true })
    )
  });}


//Admin signupf

const createAdmin = async (req, res, next) => {

  const { name, email,  password  } = req.body;
 

  let geo = geoip.lookup(req.ip);
  const browser = req.headers["user-agent"];
  const ip = JSON.stringify(req.ip);
   
  let existingUser
  try{
       existingUser = await Admin.findOne({ email : email })
  }
  catch(err){
    console.log(err)
      const error = await new HttpError("something went wrong,creating a admin failed",500)
      return next(error)
  }
  if(existingUser){
      const error = new HttpError("admin already exists",422)
      return next(error)
  }

  
  let hashedPassword;

 try{
  hashedPassword = await bcrypt.hash(password, 12)
 } 
 catch(err){
   console.log(err)
     const error = new HttpError("could not create fuser",500);
     return next(error)
 }


  const createdAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      ip,
      browser
   
  })

  try {
      await createdAdmin.save();
    } catch (err) {
      const error = new HttpError(
        'Creating Admin failed, please try again.',
        500
      );
      console.log(err)
      return next(error);
    }

    let token;
    try{
      token = await jwt.sign({
          userId : createdAdmin.id,
          email : createdAdmin.email 
           },
          process.env.JWT_KEY,
          {expiresIn :'1h'}
          )

    }
   catch (err) {
     console.log(err)
      const error = new HttpError(
        'Creating Admin failed, please try again.',
        500
      );
      return next(error);
    }
  
   
  res.status(201).json({ userId : createdAdmin.id,email : createdAdmin.email , token: token})
}

//admin login 
const  adminLogin = async(req, res, next) => {
 
  const { email,password  } = req.body;

  let admin
  try{
       admin = await Admin.findOne({ email : email  })
  }
  catch(err){
      const error = await new HttpError("something went wrong,logging in failed",500)
      return next(error)
  }

  if(!admin){
      const error = new HttpError("invalid credentials could not log in",401)
      return next(error)
  }

 let isValidPassword = false; 
 try{
       isValidPassword = await bcrypt.compare(password, admin.password)
 }
 catch(err){
  const error = await new HttpError("invalid credentials try again",500)
  return next(error)
}

if(!isValidPassword){
  const error = new HttpError("invalid credentials could not log in",401)
  return next(error)
}



let token;
try{
token = await jwt.sign({
    userId : admin.id,
    email : admin.email
   },
    process.env.JWT_KEY,
    {expiresIn :'1h'}
    )

}
catch (err) {
const error = new HttpError(
  'LogIn failed, please try again.',
  500
);
return next(error);
} 
console.log("logged in");
res.json({ 
  message : 'admin logged in successful' , 
  userId : admin.id,
  email : admin.email , 
  token: token})

}

//get states count
const getStatesCount = async (req ,res ,next) => {


  let states
try{
    states = await State.find().countDocuments()
}
catch(err){
    const error = new HttpError("can not fetch states complete request",500)
    return next(error)
}
res.json({ states : states})


}

//get cities count
const getCitiesCount = async (req ,res ,next) => {


  let cities
try{
    cities = await City.find().countDocuments()
}
catch(err){
    const error = new HttpError("can not fetch cities complete request",500)
    return next(error)
}
res.json({ cities : cities})


}

//get services count
const getServicesCount = async (req ,res ,next) => {


  let services
try{
    services = await State.find().countDocuments()
}
catch(err){
    const error = new HttpError("can not fetch services complete request",500)
    return next(error)
}
res.json({ services : services})


}

//get users count
const getServiceProvidersCount = async (req ,res ,next) => {


  let serviceProviders
try{
    serviceProviders = await ServiceProvider.find().countDocuments()
}
catch(err){
    const error = new HttpError("can not fetch serviceProviders complete request",500)
    return next(error)
}
res.json({ serviceProviders : serviceProviders})


}

//add image slider 

const addSliderImage = async (req ,res, next) => {
 
  const { title, description   } = req.body;
  let SingleFilePath ;
  let imgPath ;

  const fileSingle = req.files.image;

  console.log(fileSingle)

  if(!fileSingle){
      const error = new Error("please single choose files");
      return next(error)
    }
    
    fileSingle.forEach(img => {
      console.log(img.path)
       imgPath = img.path;
       SingleFilePath = imgPath
    })


  
 const createdSlider = new Slider ({
  title,
  description,
  image:SingleFilePath,
 })
console.log(req.files.path)
 try {
  createdSlider.save()
 }
 catch(err) {
  console.log(errors);
  const error =  new HttpError("invalid input are passed,please pass valid data",422)
  return next(error)
 }
   
 res.status(201).json({ slider : createdSlider });


}


//get image slider 

const getSliderImage = async (req ,res, next) => {
let sliderImages;
 try {
  sliderImages = await Slider.find()
 }
 catch(err) {
  console.log(errors);
  const error =  new HttpError("invalid input are passed,please pass valid data",422)
  return next(error)
 }
   
 res.status(201).json({ slider : sliderImages });


}

//Delete Slider Images ById
const deleteSliderImageById = async (req, res, next) => {
  const SliderId = req.params.bid;
  Slider.findByIdAndRemove(SliderId)
  .then((result) => {
    res.json({
      success: true,
      msg: `Slider has been deleted.`,
      result: {
        _id: result._id,
        title: result.title,
      }
    });
  })
  .catch((err) => {
    res.status(404).json({ success: false, msg: 'there is no Slider image to delete with provided id.' });
  });

};

//Delete Service  ById
const deleteServiceById = async (req, res, next) => {
  const serviceId = req.params.bid;
  Service.findByIdAndRemove(serviceId)
  .then((result) => {
    res.json({
      success: true,
      msg: `Service has been deleted.`,
      result: {
        _id: result._id
      }
    });
  })
  .catch((err) => {
    res.status(404).json({ success: false, msg: 'there is no Service  to delete with provided id.' });
  });

};

//deleteCitiesById
const deleteCitiesById = async (req, res, next) => {
  const cityId = req.params.bid;
  City.findByIdAndRemove(cityId)
  .then((result) => {
    res.json({
      success: true,
      msg: `City has been deleted.`,
      result: {
        _id: result._id
      }
    });
  })
  .catch((err) => {
    res.status(404).json({ success: false, msg: 'there is no City  to delete with provided id.' });
  });

};

exports.addState = addState;
exports.addCity = addCity;
exports.getAllStates = getAllStates;
exports.getAllCities = getAllCities;
exports.getListOfCities = getListOfCities;

exports.addService = addService;

exports.getListofServicesByCityId = getListofServicesByCityId;
exports.AddServiceProvider = AddServiceProvider;
exports.getListofServices = getListofServices;

exports.getListOfServiceProvidersByServiceId =getListOfServiceProvidersByServiceId;

exports.createAdmin = createAdmin;
exports.adminLogin = adminLogin;

//count

exports.getStatesCount  = getStatesCount;
exports.getServicesCount = getServicesCount;
exports.getServiceProvidersCount = getServiceProvidersCount;
exports.getCitiesCount = getCitiesCount;

//slider

exports.addSliderImage = addSliderImage;
exports.getSliderImage = getSliderImage;
exports.deleteSliderImageById = deleteSliderImageById;

exports.deleteServiceById = deleteServiceById;
exports.deleteCitiesById = deleteCitiesById;