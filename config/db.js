const mongoose = require('mongoose');
const colors = require('colors');

// const connect = async ()=>{
//     try{
//         await mongoose.connect(process.env.MONGODB_URL)
//         console.log(`Database connected successfully ${mongoose.connection.host}`.bgGreen.white)
//     }

//     catch(error){
//         console.log(`MongoDb Database Error ${error}`.bgRed.white)
//     }


// }

// module.exports = connect;

exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlparser:true,
        useUnifiedTopology:true,
    })

    .then(console.log(`DB Connection Success`))
    .catch((err)=>{
        console.log(`db connection failed`)
        console.log(err);
        process.exit(1);
    })
}