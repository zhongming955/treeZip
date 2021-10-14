/*
 * @Author: your name
 * @Date: 2021-10-12 16:51:37
 * @LastEditTime: 2021-10-14 16:19:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue\demo\electron\utils\zip.js
 */

const fs = require('fs')
const archiver = require('archiver')
function zip(files){
    return new Promise(function(resolve, reject){
        let filePaths_char =files.map(item=> {
            return item.split('\\')
        })
        let n = 0
        let flag = true
        while(n<filePaths_char[0].length && flag){
            let char = filePaths_char[0][n]
            for(let i=0; i<filePaths_char.length; i++){
                if(filePaths_char[i][n] !== char){
                    flag = false
                    break;
                }
            }
            n++
    
        }
        let dir = filePaths_char[0].slice(0,n-1).join('/')
        let output = fs.createWriteStream(dir+'/'+(files.length === 1?filePaths_char[0][n-1]:filePaths_char[0][n-2])+ '.zip')
        let  archive = archiver('zip',{
            zlib: {level:9}
        })
        output.on('close', function(){
            resolve(dir)
        })
        archive.on('error',function(err){
            console.log('error',err)
            reject(err)
        })
        //zip
        archive.pipe(output)
        files.forEach((path,index) => {
            let subPath = filePaths_char[index].slice(n-1).join('/')
            if(fs.statSync(path).isFile()){
                archive.file(path,{
                    name:subPath
                })
            }else {
                archive.directory(path,subPath)
            }
        })
        archive.finalize()
    })

}
function zipTree(fileData=[],createPath){
    return new Promise(function(resolve, reject){
        let dir = ''
        fileData = fileData.flatMap((item) => {
            if(dir && item.path.includes(dir)) return []
            if(!item.isFile){
                dir = item.path
                return [item]
            }
            return [item]
        })
        let filePaths_char =fileData.map(item=> {
            return item.path.split('\\')
        })
        let n = 0
        let flag = true
        while(n<filePaths_char[0].length && flag){
            let char = filePaths_char[0][n]
            for(let i=0; i<filePaths_char.length; i++){
                if(filePaths_char[i][n] !== char){
                    flag = false
                    break;
                }
            }
            n++
    
        }
        let output = fs.createWriteStream(createPath+'/'+filePaths_char[0][n-2]+ '.zip')
        let  archive = archiver('zip',{
            zlib: {level:9}
        })
        output.on('close', function(){
            resolve()
        })
        archive.on('error',function(err){
            console.log('error',err)
            reject(err)
        })
        //zip
        archive.pipe(output)
        fileData.forEach((data,index) => {
            let subPath = filePaths_char[index].slice(n-2).join('/')
            if(data.isFile){
                archive.file(fileData[index].path,{
                    name:subPath
                })
            }else {
                archive.directory(fileData[index].path,subPath)
            }
        })
        archive.finalize()
    })

}
module.exports = {zip, zipTree}