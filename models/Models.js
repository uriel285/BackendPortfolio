var pool = require('../bd')

async function getProjects(){
    var query = "select * from projects order by id desc";
    var rows = await pool.query(query);
    return rows
}

async function insertProjects(obj) {
    try{
        var query = "insert into projects set ?";
        var rows = await pool.query(query, obj);
        return rows;
    }
    catch (error){
        console.log(error);
        throw error;
    }
}

async function deleteProjectsById(id){
    var query = "delete from projects where id = ?";
    var rows = await pool.query(query, [id]);
    return rows
};

async function getProjectsById(id){
    var query = "select * from projects where id = ?";
    var rows = await pool.query(query, [id]);
    return rows[0];
};

async function modificarProjectsById(obj, id){
    try{
        var query = "update projects set ? where id = ?";
        var rows = await pool.query(query, [obj, id]);
        return rows;
    }
    catch(error){
        throw error;
    }
};

module.exports = {getProjects, insertProjects, deleteProjectsById, getProjectsById, modificarProjectsById}