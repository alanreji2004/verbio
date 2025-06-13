const {admin,db} = require('../firebase')

const verifyToken = async (req,res,next) => {
    const authHeader = req.headers.authorization;  

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message : 'No token provided'});
    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = await admin.auth().verifyIdToken(token);
        const uid = decoded.uid;
        let name = decoded.name;

        if(!name){
            const userDoc = await db.collection('users').doc(uid).get();
            if(userDoc.exists){
                name = userDoc.data().name||'unknown';
            }
            else{
                name = 'unknown'
            }
        }

        req.user = {
            uid,
            name
        }

        next()
    }
    catch(err){
        console.log(err);
        res.status(401).json({message : 'Invalid or expired Token'});
    }
};

module.exports = verifyToken;