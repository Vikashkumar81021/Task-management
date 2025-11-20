import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";
/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management APIs
 */

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - priority
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               dueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Forbidden
 */
const createTask=async(req,res)=>{
    try {
       const { title, description, dueDate, priority } = req.body;
          if (!title || !description || !priority) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }
    const newTask=await Task.create({
        title,
        description,
        dueDate,
        priority,
        status:"pending",
    createdBy:req.user.id
    })
    return res.status(201).json({
        success:true,
        message:"Task created succesfully",
        data:newTask
    })
    } catch (error) {
       return res.status(500).json({ success: false, message: error.message });
    }
}
/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *       - in: query
 *         name: assignedTo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tasks fetched successfully
 *       500:
 *         description: Server error
 */
 const getTasks = async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.query;
    const filter = {};
    if (req.user.roles.includes("user")) {
      filter.assignedTo = req.user.id;
    }
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter).populate("assignedTo", "userName email").populate("createdBy", "userName email");

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully.",
      data: tasks
    });

  } catch (error) {
    console.error(error);
   return res.status(500).json({ success: false, message: error.message });
  }
};
/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task fetched successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
 const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "userName email")
      .populate("createdBy", "userName email");

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found." });
    }
if (req.user.roles.includes("user")) {
  if (task.assignedTo?._id.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: "Forbidden." });
  }
}

    return res.status(200).json({ success: true, message: "Task fetched successfully.", data: task });

  } catch (error) {
    console.error(error);
   return res.status(500).json({ success: false, message: error.message });
  }
};
/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   patch:
 *     summary: Update task by ID
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *               dueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found." });
    const { title, description, dueDate, priority, status } = req.body;

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;

    await task.save();

    return res.status(200).json({ success: true, message: "Task updated successfully.", data: task });

  } catch (error) {
    console.error(error);
   return res.status(500).json({ success: false, message: error.message });
  }
};
/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Delete task by ID
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */


 const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found." });

    return res.status(200).json({ success: true, message: "Task deleted successfully." });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
/**
 * @swagger
 * /api/v1/tasks/{id}/assign:
 *   post:
 *     summary: Assign task to a user
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assignedTo
 *             properties:
 *               assignedTo:
 *                 type: string
 *                 description: User ID to assign task
 *     responses:
 *       200:
 *         description: Task assigned successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Task or User not found
 *       500:
 *         description: Server error
 */
 const assignTask = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found." });
    const userToAssign = await User.findById(assignedTo);
    if (!userToAssign) return res.status(404).json({ success: false, message: "User not found." });

    task.assignedTo = assignedTo;
    await task.save();
    io.emit(`taskAssigned-${assignedTo}`, {
      message: `A new task "${task.title}" has been assigned to you.`,
      taskId: task._id
    });
    console.log(`Notification emitted to user ${assignedTo}`);
    return res.status(200).json({ success: true, message: "Task assigned successfully.", data: task });

  } catch (error) {
    console.error(error);
  return res.status(500).json({ success: false, message: error.message });
  }
};



export {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,

};
