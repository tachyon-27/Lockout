import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import generateRandomString from "../utils/generateRandomString.js";
import axios from 'axios';

export const addCFID = asyncHandler(async (req, res) => {
  try {
      const { cfid } = req.body;
      const user = req.user;

      const cfuser = user.codeforcesID.find((cfhandle) => cfhandle.cfid === cfid);
      const verifyString = generateRandomString();

      if (cfuser) {
          if (cfuser.isVerified) {
              return res.json(new ApiResponse(401, "Codeforces handle already exists!"));
          } else {
              cfuser.verifyString = verifyString;
              await user.save();
          }
      } else {
          user.codeforcesID.push({
              cfid, 
              verifyString,
          });
          await user.save(); 
      }

      return res.status(201).json(new ApiResponse(201, "Codeforces ID added, authorize it.", { verifyString }));
  } catch (error) {
      res.status(501);
      throw new Error(error);
  }
});

export const verifyCFID = asyncHandler(async (req, res) => {
    try {
        const { cfid } = req.body;
        const cfres = await axios.get(`https://codeforces.com/api/user.info?handles=${cfid}`)
        
        const code = cfres.data.result[0].firstName;
        const updatedUser = await User.findOneAndUpdate(
            { 
              _id: req.user._id,
              'codeforcesID.cfid': cfid,  
              'codeforcesID.verifyString': code 
            },
            { 
              $set: { 'codeforcesID.$.isVerified': true } ,
              $unsset: {'codeforcesID.$.verifyString': 1} 
            },
            { new: true }
        );

        if(!updatedUser) {
          return res.json(new ApiResponse(401, "Unable to authorize the codeforces handle, please try again."))
        }
        else {
          return res
              .status(201)
              .json(new ApiResponse(201, "Codeforces handle authorized successfully."))
        }
    } catch(error) {
        res.status(501)
        res.json(new ApiResponse(501, error))
    }
})