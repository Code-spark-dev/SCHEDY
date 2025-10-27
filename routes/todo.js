const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb"); 

// 미들웨어
router.use((req, res, next) => {
  req.todoCollection = req.app.locals.db.collection("todo");
  next();
});

//할 일 목록 조회
router.get("/", async(req,res)=>{
    try{
        const todoCollection = req.todoCollection;

        const planned = await todoCollection
        .find({status:"planned"})
        .toArray();

        const ongoing = await todoCollection
        .find({status:"ongoing"})
        .toArray();

        const complete = await todoCollection
        .find({status:"complete"})
        .toArray();

        res.json({
            planned,
            ongoing,
            complete,
        });
    } catch(err){
        console.error("목록 조회 실패",err);
        res.status(500).json({message:"서버오류"})
    }
});

//할일 목록 추가
router.post("/", async(req,res)=>{
    try{
        const todoCollection = req.todoCollection;
        const {content, dueDate, dueTime} = req.body;

        const dueDateTime = new Date(`${dueDate}T${dueTime}`);
        const startDate = new Date();

        const newTodo = {
            content,
            dueDate:dueDateTime,
            startDate,
            status:"planned",
        };
        const result = await todoCollection.insertOne(newTodo);

        res.status(201).json({
            message: "할 일 등록 성공",
            data: { _id: result.insertedId, ...newTodo },
        });
  } catch (err) {
    console.error("할 일 등록 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

//할 일 목록 삭제
router.delete("/:id", async(req,res)=>{
    try{
        const todoCollection = req.todoCollection;
        const {id} = req.params;
        const result = await todoCollection
        .deleteOne({_id: new ObjectId(id)})

        res.status(200).json({
            message: "삭제 완료",
            deletedId: id,
        });
  } catch (err) {
    console.error("할 일 삭제 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

//할 일 목록 수정
router.put("/:id", async(req,res)=>{
    try{
        const todoCollection = req.todoCollection;

        const {id} = req.params;
        const {content, dueDate, dueTime} = req.body;
        const dueDateTime = new Date(`${dueDate}T${dueTime}`);

        const updateData = {content,dueDate: dueDateTime,};

        const result = await todoCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
    );
        res.status(200).json({
            message: "할 일 수정 성공",
            updatedData: updateData,
        });
  } catch (err) {
    console.error("할 일 수정 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;