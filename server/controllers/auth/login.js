const jwt = require('jsonwebtoken');

new utilities.express.Service('loginController')
    .isPublic()
    .isPost()
    .respondsAt('/auth/login')
    .controller((req, res)=>{

        if(req.body.email === process.env.ADMIN_EMAIL && req.body.password === process.env.ADMIN_PASSWORD) {
            return res.resolve({ token: jwt.sign({
                    email: req.body.email
                }, process.env.JWT_SECRET, {expiresIn: '1day'}) });
        }
        else
            res.forbidden("Invalid login credentials");

    })