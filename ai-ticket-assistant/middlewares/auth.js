// import jwt from "jsonwebtoken";

// export const authenticate = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ error: "Access Denied. No token found." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("DECODED JWT:", decoded); 
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: "Invalid token" });
//   }
// };


import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log("Authorization header received:", authHeader);

  const token = authHeader?.split(" ")[1];
  // console.log("Extracted token:", token);

  if (!token) {
    // console.log("No token found in request");
    return res.status(401).json({ error: "Access Denied. No token found." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded token payload:", decoded);
    // console.log("✅ Token Verified for user:", decoded._id);
    req.user = decoded;
    next();
  } catch (error) {
    // console.log("JWT verification error:", error.message);
    res.status(401).json({ error: "Invalid token" });
  }
};

