const Camp = require('../models/camp');
const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require ("bcryptjs");
// Get all camps
exports.getCamps = async (req, res) => { 
    try { 
        const camps = await Camp.find(); 
        res.status(200).json(camps); 
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
}; 

// Get a specific camp by ID
exports.getCamp = async (req, res) => {
    try { 
        const { id } = req.params;
        const camp = await Camp.findById(id);
        if (!camp) return res.status(404).json({ message: 'camp name not found' }); 
        res.json(camp); 
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
};
    
// Create a new camp
exports.createCamp = async (req, res) => {
    const { camp_name, camp_detail, camp_place, camp_manager,date,time } = req.body;
    const camp = new Camp({ camp_name, camp_detail, camp_place,camp_manager, date,time });
    try { 
        const newCamp = await camp.save();
        res.status(201).json(newCamp); 
    } catch (err) { 
        res.status(400).json({ message: err.message }); 
    }
};

// Update a camp by ID
exports.updateCamp = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCamp = await Camp.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCamp) return res.status(404).json({ message: 'Camp not found' });
        res.status(200).json(updatedCamp);
    } catch (err) { 
        res.status(400).json({ message: err.message }); 
    }
};

// Delete a camp by ID
exports.deleteCamp = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCamp = await Camp.findByIdAndDelete(id);
        if (!deletedCamp) return res.status(404).json({ message: 'Camp not found' });
        res.status(200).json({ message: 'Camp deleted successfully' });
    } catch (err) { 
        res.status(400).json({ message: err.message }); 
    }
};