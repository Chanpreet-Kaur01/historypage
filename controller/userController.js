import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sign from "../model/sign.js";

// export const create = async (req , res)=>{
//     console.log("12345")
//     try{
//         const {name,email,address}=req.body;
//         const userExist = await User.findOne ({email})
//         if(userExist){
//             return res.status(400).jason({message : "user already exists."});
//         } 
//         const savedUser=await userData.save();
//         res.status(200).json(savedUser);
//     }catch(error){
//         res.status(500).json({error:"Internal server error."});
//     }
// }

export const createUser = async (req, res) => {
    try 
    {
        console.log("testing..")
        const { secretKey, Password , email} = req.body; // Extract title and description from request body

        // Ensure images are uploaded and processed
        // const imageUrls = req.images; // This array is set by the uploadMultiple middleware

        // if (!imageUrls || imageUrls.length === 0) {
        //     return res.status(400).json({ message: "No images provided" });
        // }
        const salt= await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password , salt);
        if (secretKey!="123"){
            return res.status(403).json({
                success: false,
                message: "Wrong Secret Key",
            });
        }
        
        // Create a new user document
        const  newUser = new sign({
            // Image: imageUrls,
            Password:hashedPassword,
            email
        });
        
        const existingUser = await sign.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            });
        }
        
                // Save to database
                await newUser.save();
                res.status(201).json({message: "Data saved successfully",data: newUser });     
            
            
                
        }
    
    catch (error) {
       // console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error",error });
    }
};

export const create = async (req, res) => {
    console.log("12345");
    try {
        const { title, description } = req.body;
        


        // Create a new user instance
        const userData = new User({
            title,
            description
        });

        // Save the user to the database
        const savedUser = await userData.save();
        res.status(200).json(savedUser);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: "Internal server error." });
    }
};


export const fetch = async (req , res)=>{
    try{
        const users = await User.find();
        if (users.length == 0){
            return res.status(404).json({message : "User not found."})
        }
        res.status(200).json(users);
    }catch (error){
        res.status(500).json({error:"Internal server error."});
    }
};

export const update = async (req , res) =>{
    try {
        const id = req.params.id;
        const userExist = await User.findOne({_id:id})
        if (!userExist){
            return res.status(404).json({message : "User not found."})
        }
        const updateUser = await User.findByIdAndUpdate(id , req.body , {new:true})
        res.status(201).json(updateUser);
    }catch (error){
        res.status(500).json({error:"Internal server error."});
    }
};

export const deleteUser = async (req , res)=>{
    try{
        const id = req.params.id;
        const userExist = await User.findOne({_id:id})
        if (!userExist){
            return res.status(404).json({message : "User not found."})
        }
        await User.findByIdAndDelete(id);
        res.status(201).json({message:"user deleted successfully."})
    }catch(error){
        res.status(500).json({error:"Internal server error."});
    }
};

//export const loginUser = async (req,res)=>{
  //  try
    //{
      //  console.log("login testing..")
        //const {email , Password}=req.body;
        //const userExist = await sign.findOne({email})
        //if (!userExist){
          //  return res.status(404).json({message : "User not found."})
        //}
        //console.log("11")
       // const verifyPassword = await bcrypt.compare(Password , userExist.Password);
        //if (!verifyPassword)
        //{
          //  res.status(401).json({message:"Invalid Username or password."});
        //}
        //console.log("22")
       // res.status(200).json({message : "Login Succesful"});
    //}catch(error){
       // res.status(500).json({error:"Internal server error."});
    //}
//};
export const loginUser = async (req, res) => {
	try {
		// Get email and password from request body
		const { email, password } = req.body;

		// Check if email or password is missing
		if (!email || !password) {
			// Return 400 Bad Request status code with error message
			return res.status(400).json({
				success: false,
				message: "Please Fill up All the Required Fields",
			});
		}

		// Find user with provided email
		let user = await sign.findOne({ email })

        
        
		// If user not found with provided email
		if (!user) {
            // Return 401 Unauthorized status code with error message
			return res.status(401).json({
                success: false,
				message: "User is not Registered with Us Please SignUp to Continue",
			});
		}
        const payload = {
            email: user.email,
            id: user._id,
          };
        
          if (await bcrypt.compare(password, user.Password)) {
            let token = jwt.sign(payload, 'Im12@johnkhore', {
              expiresIn: "24h",
            });
            
            
      
          user = user.toObject();
          user.token = token;
          console.log(user);
          user.password = undefined;
          console.log(user);
          console.log("token:",token);
          
      
          const options ={
            expires: new Date( Date.now() + 3 * 24 * 60 * 60 * 1000),
            //not access on client side
            // httpOnly:true,
              sameSite: "None",

          }
          res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"User Logged in successfully"
          })
        }
        else {
            //password does not match
            return res.status(403).json({
              success: false,
              message: "Please enter correct Password",
            });
	    }
    } catch (error) {
		console.error(error);
		// Return 500 Internal Server Error status code with error message
		return res.status(500).json({
			success: false,
			message: "Login Failure Please Try Again"
		});
	}
}

