const express = require("express")
const router = express.Router()
const auth = require('../middlewares/auth');
const {createTask, getTasks ,updateTask, deleteTask,createTasksBulk,
    updateTasksBulk ,softdeleteTask
}= require("../contolelrs/taskController")


router.post("/",auth , createTask)
router.put("/bulk", auth, updateTasksBulk); // 🔥 bulk update
router.post("/bulk", auth, createTasksBulk); // 🔥 bulk create
router.get("/",auth , getTasks)
router.put("/:id",auth , updateTask)
router.delete("/:id",auth , deleteTask)
router.delete("trash/:id",auth , softdeleteTask)

module.exports =router