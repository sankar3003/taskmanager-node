const User = require('../models/User');// Get all users (exclude password for security)


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // remove password field
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single user + tasks
exports.getUserWithTasks = async (req, res) => {
    try {
        // console.log("SDF ####")
        const user = await User.findById(req.params.id)
            .select('-password')             // hide password
            .populate('tasks');              // include tasks

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// Get current logged-in user + tasks + filter tasks by status (if query provided)
exports.getMyProfile = async (req, res) => {
    try {
        // Build filter for tasks
        const taskFilter = {};
        if (req.query.status) {
            taskFilter.status = req.query.status;   // pending / completed
        }

        const user = await User.findById(req.user._id)
            .select('-password')  // hide password
            .populate({
                path: 'tasks',
                match: taskFilter,       // 👈 filter tasks by query
                options: { sort: { createdAt: -1 } } // newest first
            });

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
