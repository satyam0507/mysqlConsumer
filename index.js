var mysql = require('mysql');


exports.handler = (event, context, callback) => {
    //prevent timeout from waiting event loop
    context.callbackWaitsForEmptyEventLoop = false;

    const pool = getPool();

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
        } else {
            // Use the connection
            connection.query('SELECT * FROM table LIMIT 1', function (error, results, fields) {
                // And done with the connection.
                connection.release();
                // Handle error after the release.
                if (error) {
                    console.log(error);
                    endPool(pool, callback);
                }
                else {
                    results.forEach(element => {
                        console.log(element);
                    });
                    endPool(pool, callback);
                }
            });
        }
    });
};

function getPool() {
    return mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
}

function endPool(pool, callback) {
    pool.end((err) => {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            console.log(null);
        }
    });
}