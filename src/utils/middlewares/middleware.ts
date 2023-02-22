// import jwt from "jsonwebtoken";
// import SendResponse from "../Response";
// import STATUS_CODES from "../StatusCodes";

// //Token authentication
// const auth = async (req, res, next) => {
//   try {
//     const tokenString = req.headers.authorization;

//     let token = tokenString.replace("Bearer ", "");
//     let secretKey = process.env.SECRET_KEY;

//     const verifyUser: any = jwt.verify(token, secretKey);
//     console.log(verifyUser);
//     if (!verifyUser) {
//       req.userId = verifyUser._id;
//       return SendResponse(
//         res,
//         { message: "User Unauthorized" },
//         STATUS_CODES.UN_AUTHORIZED
//       );

//       //  SendResponse(res, { message: "User Authorized", verifyUser: verifyUser }, STATUS_CODES.OK)
//     } else {
//       next();
//     }
//   } catch (error) {
//     return SendResponse(
//       res,
//       { message: "User Unauthorized " },
//       STATUS_CODES.UN_AUTHORIZED
//     );
//   }
// };

// //export
// export const userMiddleware = {
//   auth,
// };
