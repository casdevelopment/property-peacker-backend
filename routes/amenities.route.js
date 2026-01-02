import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { createAmenity, deleteAmenity, getAllAmenities, updateAmenity } from "../controllers/amenities.controller.js";

const amenitiesRouter = Router();

amenitiesRouter.post("/addAmenity", authorize, createAmenity);
amenitiesRouter.put("/updateAmenity/:id", authorize, updateAmenity);
amenitiesRouter.get("/getAmenities", authorize, getAllAmenities);
amenitiesRouter.delete("/deleteAmenity/:id", authorize, deleteAmenity);

export default amenitiesRouter;