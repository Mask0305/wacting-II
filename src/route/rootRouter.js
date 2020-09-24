import express from "express";
import student from "../route/studentRouter";
import teacher from "../route/teacherRouter";

const router = express.Router();

/** 學生 **/
router.use("/student",student);

/** 老師 **/
router.use("/teacher",teacher);

export default router;