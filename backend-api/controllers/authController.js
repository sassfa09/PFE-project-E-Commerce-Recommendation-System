// ==========================================================
// TODO:  Login Implementation
// ==========================================================
// 1. Receive 'email' and 'mot_de_pass' from req.body
// 2. Check if the user exists in the 'client' table using email
// 3. If user exists, compare the provided password with the Hashed password in DB
//    (Hint: Use bcrypt.compare())
// 4. If password matches, generate a JWT Token for the user
// 5. Send back the Token and basic User info as a JSON response
// ==========================================================

exports.login = async (req, res) => {
    //كتبي الكود 
    try {
        // Step 1: Get data from body
        
        // Step 2: DB Query
        
        // Step 3: Password Verification
        
        // Step 4: Token Generation (JWT)
        
        // Step 5: Final Response
        
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};