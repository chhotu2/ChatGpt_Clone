const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const db = require("./config/db");
const cookiesParser = require("cookie-parser");
const cors=require("cors");
const dotenv = require("dotenv");


const PORT = process.env.PORT||4000;

dotenv.config();

db.connect();

app.use(cors({
	origin:'*',
	credentials:true
}));
app.use(express.json());
app.use(cookiesParser());


app.use("/api/v1/auth",userRoutes);

app.get("/",(req,res)=>{
	return res.json({
		success:true,
		message:"Your server is runnning up...."
	})
})


app.listen(PORT,()=>{
	console.log(`App is listening at ${PORT}`);
})


