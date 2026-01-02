import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { addPropertyCategory, addPropertyListing, addPropertyStatus, approveProperty, deletePropertyCategory, deletePropertyListing, deletePropertyStatus, getAllProperties, getAllPropertyCategories, getAllPropertyStatuses, getPropertyById, updatePropertyCategory, updatePropertyListing, updatePropertyStatus } from "../controllers/property.controller.js";
import { uploadFile } from "../middlewares/upload.js"; // <-- import Multer middleware

const propertyRouter = Router();

// Attach uploadFile before your controller
// 'images' here is the field name for your files from the client
propertyRouter.post(
    "/listProperty",
    authorize,
    uploadFile("property_images"), // <-- Multer handles file upload
    addPropertyListing
);
propertyRouter.delete(
    "/deleteProperty/:propertyId",
    authorize,
    deletePropertyListing);

propertyRouter.put(
    "/updateProperty/:propertyId",
    authorize,
    uploadFile("property_images"), // <-- Multer handles file upload
    updatePropertyListing
);

propertyRouter.get("/getAll", authorize, getAllProperties);
propertyRouter.get("/getPropertyById/:propertyId", authorize, getPropertyById);
propertyRouter.put("/approveProperty/:propertyId", authorize, approveProperty)


propertyRouter.post("/addStatus", authorize, addPropertyStatus);
propertyRouter.get("/getAllStatuses", authorize, getAllPropertyStatuses);
propertyRouter.delete("/deleteStatus/:statusId", authorize, deletePropertyStatus);
propertyRouter.put("/updatePropertyStatus/:statusId", authorize, updatePropertyStatus);

propertyRouter.post("/addCategory", authorize, addPropertyCategory);
propertyRouter.delete("/deleteCategory/:categoryId", authorize, deletePropertyCategory);
propertyRouter.put("/updatePropertyCategory/:categoryId", authorize, updatePropertyCategory);
propertyRouter.get("/getAllCategories", authorize, getAllPropertyCategories);

export default propertyRouter;