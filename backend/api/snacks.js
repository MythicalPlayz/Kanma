import express from 'express';
import Snacks from '../models/Snack.js';
import SnacksCategory from '../models/SnackCategory.js';

const router = express.Router();

// GET /api/snacks - Returns all snacks
router.get('/', async (req, res) => {
    try {
        // this one is special because we also have categories we want first
        /*
            we want to return snacks in the following order:
            [
                {category: CategoryInfo, snacks: [...]},
            ]
        
        */
        // 
        const snacks = await Snacks.find().sort({ price: 1 });
        const categories = await SnacksCategory.find();

        let categorizedSnacks = [];
        for (let category of categories) {
            const snacksInCategory = snacks.filter(snack => snack.category === category._id);
            categorizedSnacks.push({
                category,
                snacks: snacksInCategory
            });
        }

        res.json(categorizedSnacks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;