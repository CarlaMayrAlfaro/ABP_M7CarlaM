export const validateBody = (req, res, next) => {
    if(!req.body){
        return res.status(400).json({message: "No se proporciona body."});
    }

    next();
}