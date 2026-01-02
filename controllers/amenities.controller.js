
import { Amenity, User } from "../database/sequelize.js";



export const createAmenity = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const isAdmin = await User.findOne({
            where: { id: req.user.id, roleId: 2 }
        });

        if (!isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Only admin can add amenities"
            });
        }

        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Amenity name is required"
            });
        }

        const exists = await Amenity.findOne({ where: { name } });
        if (exists) {
            return res.status(409).json({
                success: false,
                message: "Amenity already exists"
            });
        }

        await Amenity.create({
            name: name.trim(),
            added_by: req.user.id
        });

        return res.status(201).json({
            success: true,
            message: "Amenity added successfully"
        });
    } catch (error) {
        next(error);
    }
};


export const getAllAmenities = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const amenities = await Amenity.findAll();

        return res.status(200).json({
            success: true,
            data: amenities
        });
    } catch (error) {
        next(error);
    }
};


export const updateAmenity = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const isAdmin = await User.findOne({
            where: { id: req.user.id, roleId: 2 }
        });

        if (!isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Only admin can update amenities"
            });
        }

        const { id } = req.params;
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Amenity name is required"
            });
        }

        const amenity = await Amenity.findByPk(id);

        if (!amenity) {
            return res.status(404).json({
                success: false,
                message: "Amenity not found"
            });
        }

        // Check duplicate name (optional but recommended)

        await amenity.update({
            name: name.trim()
        });

        return res.status(200).json({
            success: true,
            message: "Amenity updated successfully"
        });
    } catch (error) {
        next(error);
    }
};


export const deleteAmenity = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const isAdmin = await User.findOne({
            where: { id: req.user.id, roleId: 2 }
        });

        if (!isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Only admin can delete amenities"
            });
        }

        const { id } = req.params;

        const amenity = await Amenity.findByPk(id);

        if (!amenity) {
            return res.status(404).json({
                success: false,
                message: "Amenity not found"
            });
        }

        await amenity.destroy();

        return res.status(200).json({
            success: true,
            message: "Amenity deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};
