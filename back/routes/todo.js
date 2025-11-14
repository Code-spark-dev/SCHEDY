const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb"); 

/* 미들웨어 */
router.use((req, res, next) => {
  req.todoCollection = req.app.locals.db.collection("todo");
  next();
});

const requireLogin = (req, res, next) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }
  req.userId = req.user._id;
  next();
};

/*할 일 목록 조회*/
router.get("/", requireLogin, async(req,res)=>{
    try{
        const todoCollection = req.todoCollection;

        const planned = await todoCollection
          .find({ status: "planned", userId: new ObjectId(req.userId) })
          .sort({ order: 1, _id: 1 })
          .toArray();

        const ongoing = await todoCollection
          .find({ status: "ongoing", userId: new ObjectId(req.userId) })
          .sort({ order: 1, _id: 1 })
          .toArray();

        const complete = await todoCollection
          .find({ status: "complete", userId: new ObjectId(req.userId) })
          .sort({ order: 1, _id: 1 })
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

/*할일 목록 추가*/
router.post("/", requireLogin, async(req,res)=>{
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
            userId: new ObjectId(req.userId),
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

/*할 일 목록 삭제*/
router.delete("/:id", requireLogin, async(req,res)=>{
    try{
        const todoCollection = req.todoCollection;
        const {id} = req.params;
        const result = await todoCollection
        .deleteOne({_id: new ObjectId(id), userId: new ObjectId(req.userId)})

        res.status(200).json({
            message: "삭제 완료",
            deletedId: id,
        });
  } catch (err) {
    console.error("할 일 삭제 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

/*할 일 목록 수정*/
router.put("/:id", requireLogin, async(req,res)=>{
    try{
        const todoCollection = req.todoCollection;

        const {id} = req.params;
        const {content, dueDate, dueTime} = req.body;
        const dueDateTime = new Date(`${dueDate}T${dueTime}`);

        const updateData = {content,dueDate: dueDateTime,};

        const result = await todoCollection.updateOne(
            { _id: new ObjectId(id), userId: new ObjectId(req.userId) },
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

/*할 일 status 변경*/

router.patch("/:id/position", requireLogin, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { status, order } = req.body;

    const allowedStatuses = ["planned", "ongoing", "complete"];

    //현재 status
    const todosInStatus = await db
      .collection("todo")
      .find({ status, userId: new ObjectId(req.userId) })
      .sort({ order: 1 }) //오름차순 정렬
      .toArray();

    //드래그된 todo를 해당 위치에 추가
    todosInStatus.splice(order, 0, { _id: new ObjectId(id) });
    //splice 문법 : array.splice(시작인덱스, 삭제할개수, [추가할요소1, 추가할요소2...])

    //order값 업데이트
    const newStatus = todosInStatus.map((todo, index) => ({
      updateOne: {
        filter: { _id: todo._id, userId: new ObjectId(req.userId) },
        update: { $set: { order: index } },
      },
    }));

    //status값 업데이트
    newStatus.push({
      updateOne: {
        filter: { _id: new ObjectId(id), userId: new ObjectId(req.userId) },
        update: { $set: { status, order } },
      },
    });

    // db 반영
    await db.collection("todo").bulkWrite(newStatus);

    res.status(200).json({ message: "Status update" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* 🔥 프론트에서 온 전체 상태를 저장하는 update-status */
router.put("/update-status", requireLogin, async (req, res) => {
  try {
    const todoCollection = req.todoCollection;
    console.log("✅ [PUT /update-status] body:", JSON.stringify(req.body, null, 2));
    const { planned, ongoing, complete } = req.body;

    const bulkOps = [];

    // 공용 함수: 리스트 + status로 bulkWrite 준비
    const addOps = (list, status) => {
      if (!Array.isArray(list)) return;
      list.forEach((todo, index) => {
        if (!todo._id) return;
        bulkOps.push({
          updateOne: {
            filter: { _id: new ObjectId(todo._id), userId: new ObjectId(req.userId) },
            update: {
              $set: {
                status,
                order: index,
              },
            },
          },
        });
      });
    };

    addOps(planned, "planned");
    addOps(ongoing, "ongoing");
    addOps(complete, "complete");

    if (bulkOps.length > 0) {
      await todoCollection.bulkWrite(bulkOps);
    }

    res.status(200).json({ message: "Status + order updated!" });
  } catch (err) {
    console.error("update-status Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;