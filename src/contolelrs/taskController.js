const Task = require("../models/task")

// create task for user 
exports.createTask =async (req,res)=>{
    try{
        const {title , description} = req.body
        const task = new Task({title, description ,user:req.user._id})
        await task.save()
        res.status(201).json(task)
    }
    catch(err){
res.status(500).json({message:err.message})
    }
}

// Get All Tasks of User
exports.getTasks = async (req, res) => {
    try {
           // find only tasks belonging to logged-in user
        const tasks = await Task.find({ user: req.user._id })
            .populate('user', 'name email');  
            // 👆 populate 'user' field with username + email

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update Task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        if(!task) return res.status(404).json({ message: 'Task not found' });

        const { title, description, status } = req.body;
        if(title) task.title = title;
        if(description) task.description = description;
        if(status) task.status = status;

        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete Task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if(!task) return res.status(404).json({ message: 'Task not found' });

        res.json({ message: 'Task deleted successfully ✅' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
