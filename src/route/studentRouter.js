import express from "express";
import { enterExam } from "../controller/teacher/examController";
import { studentLogin } from "../controller/student/loginController";
import { sTtConnection } from "../controller/student/sTtConnectionController";

const router = express.Router();

/** 學生登入 **/
router.post("/studentLogin",studentLogin);

/** 學生進入考場 **/
router.post("/enterExam",enterExam);        //連線至教師機進入考場，取得考場資訊

/** 學生端與教師端確認連現狀控 **/
router.get("/sTtConnection",sTtConnection);

export default router;