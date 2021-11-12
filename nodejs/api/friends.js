module.exports = {
    select: 'select * from friends',
    selectAllWechat: 'select wechat from friends',
    selectByWechat: 'select * from friends where wechat=?',
    selectBySex: 'select * from friends where sex=?',
    deleteByWechat: 'delete from friends where wechat=?',
    updateByWechat: 'update friends set password=?,sex=?,marriage=?,motto=?,age=?,stature=?,weight=?,point=?,place=?,industry=?,family=?,hobby=?,my=?,you=?,remark=? where wechat=?',
    save: 'insert into friends values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    uploadPics: 'update friends set pictures=? where wechat=?'
}
