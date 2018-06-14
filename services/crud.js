import connection from '../connection';
const debug = require('debug')('server');
const sql = 'select * from student';

export default {
    query(sql) {
        if(!sql) return;
        return new Promise((resolve, reject) => {
            connection.query(sql, function (error, results, fields) {
                if (error) {
                    reject(reject);
                    return;
                }
                resolve(results);
            });
        });
    },
    insesrt(addSql, addSqlParams) {
        if(!addSql || !addSqlParams) return;
        return new Promise((resolve, reject) => {
            connection.query(addSql, addSqlParams, function (err, result) {
                if(err){
                    reject(err);
                    return;
                }
                resolve(result);                
            });
        });
    },
    update(modSql, modSqlParams) {
        if (!modSql || !modSqlParams) return;
        return new Promise((resolve, reject) => {
            connection.query(modSql,modSqlParams,function (err, result) {
                if(err){
                    reject(err);
                    return;
                }
                resolve(result);      
            });
        });
    },
    delete(delSql) {
        if(!delSql) return;
        return new Promise((resolve, reject) => {
            connection.query(delSql,function (err, result) {
                if(err){
                    reject(err);
                    return;
                }
                resolve(result);        
            });
        });
    }
}