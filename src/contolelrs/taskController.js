
const Task = require("../models/task")

// create task for user
exports.createTask =async (req,res)=>{
    try{


      console.log("Req.body", req.user.id)
         const { title, description, priority, dueDate, labels } = req.body;
        const task= new Task({
      title,
      description,
      priority,
      dueDate,
      labels,
      user: req.user._id,
    })
        await task.save()

        res.status(201).json(task)
    }
    catch(err){
res.status(500).json({message:err.message})
    }
}

// Create multiple tasks
exports.createTasksBulk = async (req, res) => {
  try {
    const tasks = req.body; // expecting an array of tasks
    console.log("Tasks dsfd", tasks)
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ message: "Tasks must be a non-empty array" });
    }
    // Add user ID to each task
    const tasksWithUser = tasks.map((task) => ({
      ...task,
      user: req.user._id,
    }));
    // Insert all tasks
    const newTasks = await Task.insertMany(tasksWithUser);
    res.status(201).json({
      message: `${newTasks.length} tasks created successfully`,
      tasks: newTasks,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Tasks of User
exports.getTasks = async (req, res) => {
 try {
    const { page = 1, limit = 5, status, search } = req.query;
    // Build query object
    let query = { user: req.user._id };
// console.log("Query", query)
    if (status) query.status = status; // filter by status (pending/completed)
    if (search) query.title = { $regex: search, $options: "i" }; // case-insensitive search
console.log("Query", query)
    // Pagination + filtering
    const tasks = await Task.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
console.log("Tasks##", tasks)
    const total = await Task.countDocuments(query);
await res.set({ 'Content-Type': 'application/json',
       "my-Headers": 'Hello World'
       });
  await  res.json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      tasks,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        if(!task) return res.status(404).json({ message: 'Task not found' });
        const { title, description, status, priority, dueDate, labels, archived }= req.body;
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    if (labels) task.labels = labels;
    if (archived !== undefined) task.archived = archived;
        await task.save();
        res.json(task);    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Bulk update tasks
exports.updateTasksBulk = async (req, res) => {
  try {
    const { tasks } = req.body; // expecting an array of { id, fieldsToUpdate }
console.log(tasks, 'dff');

    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ message: "Tasks must be a non-empty array" });
    }

    let results = [];

    for (let t of req.body) {
      const updated = await Task.findOneAndUpdate(
        { _id: t.id, user: req.user._id }, // only update user's own tasks
        t.update,
        { new: true }
      );
      if (updated) results.push(updated);
    }

    res.json({
      message: `${results.length} tasks updated successfully`,
      tasks: results,
    });
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


// soft delete data like push into trash

exports.softdeleteTask =async (req,res)=>{
try{
const task =await Task.findOne({_id :req.param.id ,user:req.user._id})
if(!task) return res.status(404).json({'message':'task not found'})

task.deleted = true

task.history.push({action : 'deleted Task', by:req.user._id})
await task.save()
 res.json({ message: "Task moved to trash 🗑️" });
}catch (err) {
    res.status(500).json({ message: err.message });
  }
}