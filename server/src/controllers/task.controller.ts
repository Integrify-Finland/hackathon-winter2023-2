import { Request, Response } from "express";

import taskSchema, { TTask } from "../models/Task";
import { errorHandler } from "../utils/errorHandler";
import mongoose from "mongoose";

export const all = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.body;
    const Task = mongoose.model<TTask>(projectId, taskSchema);
    const allTasks = await Task.find();
    if (!allTasks) {
      return res.status(401).json({ msg: "Problem with all tasks" });
    }

    res.status(200).json({ data: allTasks });
  } catch (err) {
    errorHandler(res, err);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { text, date, status, users, projectId } = req.body;

    const Task = mongoose.model<TTask>(projectId, taskSchema);
    const task = await Task.create({ text, date, status, users });
    if (!task) {
      return res.status(401).json({ msg: "Task was not created" });
    }

    const allTasks = await Task.find();

    if (!allTasks) {
      return res.status(401).json({ msg: "Tasks was not get" });
    }

    res.status(200).json({
      data: allTasks,
    });
  } catch (err) {
    errorHandler(res, err);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { status, projectId, taskId } = req.body;

    const Task = mongoose.model<TTask>(projectId, taskSchema);
    const task = await Task.findByIdAndUpdate(taskId, { status });

    console.log(task);
    if (!task) {
      return res.status(401).json({ msg: "Task was not created" });
    }

    const allTasks = await Task.find();

    if (!allTasks) {
      return res.status(401).json({ msg: "Tasks was not get" });
    }

    res.status(200).json({
      data: allTasks,
    });
  } catch (err) {
    errorHandler(res, err);
  }
};
