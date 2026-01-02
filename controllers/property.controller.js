import { getFileUrl } from "../middlewares/upload.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import { PropertyCategory, PropertyListing, PropertyStatus, User } from "../database/sequelize.js";


export const addPropertyListing = async (req, res, next) => {
    try {
        /* ---------------- AUTH ---------------- */
        const { property_email, password } = req.body;

        if (!property_email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({
            where: { email: property_email.toLowerCase().trim() },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        /* ---------------- FILE UPLOAD ---------------- */
        let uploadedImages = [];

        if (req.files && req.files.length > 0) {
            uploadedImages = req.files.map((file) => getFileUrl(file));
        } else {
            return res.status(400).json({
                success: false,
                message: "At least one property image is required",
            });
        }

        /* ---------------- CREATE PROPERTY ---------------- */

        await PropertyListing.create({
            property_title: req.body.property_title,
            property_description: req.body.property_description,
            property_category: req.body.property_category,
            property_status: req.body.property_status,
            property_price: req.body.property_price,
            yearly_tax: req.body.yearly_tax,

            property_images: uploadedImages,

            property_address: req.body.property_address,
            property_country: req.body.property_country,
            property_state: req.body.property_state,
            property_zipcode: req.body.property_zipcode,
            property_size_ft: req.body.property_size_ft,
            property_plot_size_ft: req.body.property_plot_size_ft,
            property_rooms: req.body.property_rooms,
            property_bathrooms: req.body.property_bathrooms,
            property_garages: req.body.property_garages,
            property_floors: req.body.property_floors,
            property_built_year: req.body.property_built_year,
            property_structure_type: req.body.property_structure_type,
            property_extra_details: req.body.property_extra_details,
            property_membership_status: req.body.property_membership_status,
            property_email: req.body.property_email,
            property_amenities: req.body.property_amenities,
            is_property_approved: false,
            property_added_by: user.id,
        });

        /* ---------------- RESPONSE ---------------- */
        return res.status(201).json({
            success: true,
            message: "Property listed successfully",
        });
    } catch (error) {
        next(error);
    }
};
export const deletePropertyListing = async (req, res, next) => {
    try {
        let { propertyId } = req.params;
        let userId = req.user.id;
        const property = await PropertyListing.findOne({
            where: {
                id: propertyId,
                property_added_by: userId
            }
        });
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found or you do not have permission to delete this property"
            });
        };
        await property.destroy();
        res.status(200).json({
            success: true,
            message: "Property deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}
export const updatePropertyListing = async (req, res, next) => {
    try {
        const { propertyId } = req.params;
        let userId = req.user.id;
        // Find property and check ownership
        const property = await PropertyListing.findOne({
            where: { id: propertyId, property_added_by: userId },
        });

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found or you do not have permission to update this property",
            });
        }

        // Handle new uploaded images
        let uploadedImages = property.property_images || [];
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map((file) => getFileUrl(file));
            uploadedImages = [...uploadedImages, ...newImages];
        }

        // Pick only allowed fields to update
        const allowedFields = [
            "property_title",
            "property_description",
            "property_category",
            "property_status",
            "property_price",
            "yearly_tax",
            "property_address",
            "property_country",
            "property_state",
            "property_zipcode",
            "property_size_ft",
            "property_plot_size_ft",
            "property_rooms",
            "property_bathrooms",
            "property_garages",
            "property_floors",
            "property_built_year",
            "property_structure_type",
            "property_extra_details",
            "property_membership_status",
            "property_amenities",
        ];

        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        }

        // Add uploaded images if any
        updates.property_images = uploadedImages;

        // Update property
        await property.update(updates);

        res.status(200).json({
            success: true,
            message: "Property updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const getAllProperties = async (req, res, next) => {
    try {
        const properties = await PropertyListing.findAll({ where: { is_property_approved: true } });
        res.status(200).json({
            success: true,
            data: properties,
        });
    } catch (error) {
        next(error);
    }
};

export const getPropertyById = async (req, res, next) => {
    try {
        const { propertyId } = req.params;
        const property = await PropertyListing.findByPk(propertyId);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }
        res.status(200).json({
            success: true,
            data: property,
        });
    } catch (error) {
        next(error);
    }
};


export const approveProperty = async (req, res, next) => {
    try {

        let user = await User.findOne({ where: { id: req.user.id, roleId: 2 } });
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "Only admin can add property status",
            });
        }
        const { propertyId } = req.params;
        const property = await PropertyListing.findByPk(propertyId);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }
        await property.update({
            is_property_approved: true,
        })
        res.status(200).json({
            success: true,
            message: "Property Approved Successfully!"
        });
    } catch (error) {
        next(error);
    }
};

export const addPropertyStatus = async (req, res, next) => {
    try {
        // Check if user is admin etc
        let { id } = req.user;
        let user = await User.findOne({ where: { id: id, roleId: 2 } });
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "Only admin can add property status",
            });
        }
        await PropertyStatus.create({
            status: req.body.status,
            added_by: id,
        });

        res.status(201).json({
            success: true,
            message: "Property status added successfully",
        });
    } catch (error) {
        next(error);
    }
}

export const deletePropertyStatus = async (req, res, next) => {
    try {
        let user = await User.findOne({ where: { id: req.user.id, roleId: 2 } });
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "Only admin can add property status",
            });
        }
        let { statusId } = req.params;
        const status = await PropertyStatus.findOne({
            where: {
                id: statusId
            }
        });
        if (!status) {
            return res.status(404).json({
                success: false,
                message: "Property status not found"
            });
        };
        await status.destroy();
        res.status(200).json({
            success: true,
            message: "Property status deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const getAllPropertyStatuses = async (req, res, next) => {
    try {
        const statuses = await PropertyStatus.findAll();
        res.status(200).json({
            success: true,
            data: statuses,
        });
    }
    catch (error) {
        next(error);
    }
};

export const updatePropertyStatus = async (req, res, next) => {
    try {
        let user = await User.findOne({ where: { id: req.user.id, roleId: 2 } });
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "Only admin can update property status",
            });
        }
        const { statusId } = req.params;
        const status = await PropertyStatus.findOne({
            where: { id: statusId },
        });
        if (!status) {
            return res.status(404).json({
                success: false,
                message: "Property status not found",
            });
        }
        await status.update({
            status: req.body.status || status.status,
        });
        res.status(200).json({
            success: true,
            message: "Property status updated successfully",
        });
    } catch (error) {
        next(error);
    }
};


export const addPropertyCategory = async (req, res, next) => {
    try {
        // Check if user is admin etc
        let user = await User.findOne({ where: { id: req.user.id, roleId: 2 } });
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "Only admin can add property status",
            });
        }

        await PropertyCategory.create({
            category: req.body.category,
            added_by: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: "Property category added successfully",
        });
    } catch (error) {
        next(error);
    }
}

export const deletePropertyCategory = async (req, res, next) => {
    try {
        let user = await User.findOne({ where: { id: req.user.id, roleId: 2 } });
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "Only admin can delete property category",
            });
        }
        let { categoryId } = req.params;
        const category = await PropertyCategory.findOne({
            where: {
                id: categoryId
            }
        });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Property category not found"
            });
        };
        await category.destroy();
        res.status(200).json({
            success: true,
            message: "Property category deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const getAllPropertyCategories = async (req, res, next) => {
    try {
        const categories = await PropertyCategory.findAll();
        res.status(200).json({
            success: true,
            data: categories,
        });
    }
    catch (error) {
        next(error);
    }
};


export const updatePropertyCategory = async (req, res, next) => {
    try {
        let user = await User.findOne({ where: { id: req.user.id, roleId: 2 } });
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "Only admin can update property category",
            });
        }
        const { categoryId } = req.params;
        const category = await PropertyCategory.findOne({
            where: { id: categoryId },
        });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Property category not found",
            });
        }
        await category.update({
            category: req.body.category || category.category,
        });
        res.status(200).json({
            success: true,
            message: "Property category updated successfully",
        });
    } catch (error) {
        next(error);
    }
};
