import mongoose from "mongoose";
import { Task } from "../models/task.model.js";
import { redisClient } from "../config/redis.js";
const CACHE_EXPIRATION = 180;
/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Task analytics and reporting APIs
 */

/**
 * @swagger
 * /api/v1/analytics/user/{userId}:
 *   get:
 *     summary: Get task statistics for a single user
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successfully fetched user task analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 analytics:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Task status
 *                       count:
 *                         type: number
 *       500:
 *         description: Server error
 */

const taskStats=async(req,res)=>{
  try {
  const userId = req.params.userId;
const cacheKey = `userStats:${userId}`;
const cacheData =await redisClient.get(cacheKey)
if(cacheData ){
    return res.status(200).json({
        success:true,
        analytics:JSON.parse(cacheData )
    })
}
const userStats = await Task.aggregate([
  { $match: { assignedTo: new mongoose.Types.ObjectId(userId) } },
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 }
    }
  }
]);
await redisClient.setex(cacheKey,CACHE_EXPIRATION,JSON.stringify(userStats))
    return res.status(200).json({
      success:true,
      analytics:userStats,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}


/**
 * @swagger
 * /api/v1/analytics/user/{id}/overdue:
 *   get:
 *     summary: Get overdue tasks for a user
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of overdue tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 overDusTasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       500:
 *         description: Server error
 */
const overDueTask=async(req,res)=>{
  try {
    const userId=req.params.id
    const today=new Date()
    const overDueTask=await Task.find({
      assignedTo:userId,
       dueDate: { $lt: today },
      status: { $ne: "completed" }
    })
    return res.status(200).json({
      success:true,
      count:overDueTask.length,
       overDusTasks:overDueTask
    })
  } catch (error) {
     return res.status(500).json({ success: false, message: error.message });
  }
}
/**
 * @swagger
 * /api/v1/analytics/team:
 *   post:
 *     summary: Get analytics for team users (task count by status)
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["6734c9f34ab0f03e92e9a6d1", "6734cb2e4ab0f03e92e9a6e3"]
 *     responses:
 *       200:
 *         description: Team analytics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       count:
 *                         type: number
 *       500:
 *         description: Server error
 */
const getTeamAnalytics = async (req, res) => {
  try {
    const teamUserIds = req.body.userIds; 
    const stats = await Task.aggregate([
      { $match: { assignedTo: { $in: teamUserIds } } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export{
    taskStats,
    overDueTask,
    getTeamAnalytics
}