import multer from 'multer';

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'src/uploads');
    },
    filename:function(req,file,cb){
        const uniq=Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null,uniq + '-' + file.originalname);
    }
})

export default multer({
    storage:storage
});