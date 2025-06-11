const {admin} = require('../firebase')

const verifyToken = async (req,res,next) => {
    const authHeader = req.headers.authorization;  

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message : 'No token provided'});
    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = decoded;
        next()
    }
    catch(err){
        console.log(err);
        res.status(401).json({message : 'Invalid or expired Token'});
    }
};

module.exports = verifyToken;