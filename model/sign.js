import mongoose from "mongoose";

const SignSchema = new mongoose.Schema({
    
   
    Password:{
        type : String ,
        required : true 
    },
    email : {
        type : String ,
        required : true
    }

})

export default mongoose.model("sign",SignSchema);
    