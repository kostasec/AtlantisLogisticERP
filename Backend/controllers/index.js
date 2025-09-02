exports.getReadIndex = async (req, res, next) => {
        res.render('index', {
        pageTitle: 'Home',
        path: '/'
        })
    };
