var net = require('net');
var server = null;
var sockets = [];

function serverConnect() {
    if (server == null) {
        server = net.createServer(function(connection) {
            sockets.push(connection);

            for (let i = 0; i < sockets.length; i++)
                sockets[i].setTimeout(1000, function() {
                    console.log('Сокет простаивает. Отключаю');
                    sockets[i].end();
                    sockets[i].destroy();
                    sockets.splice(i, 1);
                });

            console.log('Клиент подключен');

            connection.on('end', function() {
                console.log('Bye, Client!');
            });

            connection.on('data', function(data) {
                console.log(`С клиента пришло - ${data.toString()}`);
            });

            connection.write('Hello World, my client!\r\n');
            connection.pipe(connection);

            connection.on('error', function() {
                console.log('Возникла ошибка! Перезапускаю сервер...');
                if (server.getConnections == 0) {
                    if (server != null) {
                        server.close();
                        server = null;
                    }
                }
            });
        });

        server.listen(8080, function() {
            console.log('Сервер готов к работе. Ожидаем клиентов...');
        });

        server.on('close', function() {
            console.log('Сервер закрыл соединение. Переподключаюсь...');
            server = null;
            serverConnect();
        });
    }
}

try {
    if (server == null)
        serverConnect();
}
catch (err) {
    console.log(`Error: ${err}`);
    server = null;
    serverConnect();
}