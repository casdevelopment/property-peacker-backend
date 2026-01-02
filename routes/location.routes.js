import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { getAllCities, getAllCountries, getStates } from "../controllers/location.controller.js";


const locationRouter = Router();

locationRouter.get("/getContries", authorize, getAllCountries);
locationRouter.get("/getStates/:countryId", authorize, getStates);
locationRouter.get("/getCities/:stateId", authorize, getAllCities);



export default locationRouter;
