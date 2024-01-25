const express=require("express");
const router=express.Router();
const connection=require('../db/dbconnect')

router.get("/student",(req,resp)=>{
    connection.query("select * from student",(err,data)=>{
        if(err){
            resp.status(500).send("data not found"+JSON.stringify(err))
        }
        else{
            console.log("Data retrieved from database:", data);
            //resp.send(data)
           resp.render('student', { students: data });
        }
    })
})

router.get("/student/new", (req, resp) => {
    resp.render('newStudent');
});

// router.js
router.post("/student/insert", (req, resp) => {
    const { sname, sposition } = req.body;

    if (!sname || !sposition) {
        resp.status(400).send("Name and Position are required.");
        return;
    }

    connection.query("INSERT INTO student (name, position) VALUES (?, ?)", [sname, sposition], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err.sqlMessage);
            resp.status(500).send("Data not inserted");
        } else {
            console.log("Insert result:", result);
            if (result.affectedRows > 0) {
                resp.send("{'msg':'Inserted successfully'}");
            } else {
                resp.send("{'msg':'Not inserted'}");
            }
        }
    });
});




router.put("/student/update",(req,resp)=>{
    var sid=req.body.sid;
    var sname=req.body.sname;
    connection.query("update student set sname=? where sid=?",[sname,sposition],(err,result)=>{
        console.log(result);
        if(err){
            resp.status(500).send("data not updated")
        }
        else{
            if(result.affectedRows>0)
            resp.send("{'msg':'update successfully'}")
            else
            resp.send("{'msg':'not updated'}")
        }
})
})

router.delete("/student/delete/:id",(req,resp)=>{
    const studentId = req.params.id;
    console.log("Deleting student with ID:", studentId);
    connection.query("DELETE FROM student WHERE id = ?", [studentId], (err, result) => {
        if (err) {
            console.error("Error deleting data:", err.sqlMessage);
            resp.status(500).send(`Data not deleted. Error: ${err.sqlMessage}`);
        }
         else {
            console.log("Delete result:", result);
            if (result.affectedRows > 0) {
                resp.send("{'msg':'Delete successful'}");
            } else {
                resp.send("{'msg':'Data not deleted'}");
            }
        }
    });
});

module.exports=router;

