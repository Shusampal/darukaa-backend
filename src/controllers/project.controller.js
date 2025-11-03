const projectService = require("../services/project.service");

async function createProject(req, res, next) {
  try {
    const ownerId = Number(req.user.userId);
    const project = await projectService.createProject(ownerId, req.body);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

async function listProjects(req, res, next) {
  try {
    const ownerId = Number(req.user.userId);
    const projects = await projectService.listProjects(ownerId);
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

async function getProject(req, res, next) {
  try {
    const ownerId = Number(req.user.userId);
    const { projectId } = req.params;
    const projects = await projectService.getProject(ownerId, projectId);
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

module.exports = { createProject, listProjects, getProject };
