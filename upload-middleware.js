const multer = rquire('multer')

const storage = multer.memoryStorage()

const upload = multer({storage: storage})

module.exports = upload