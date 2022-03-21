var net = require('net');
var server = null;

function serverConnect() {
    if (server == null) {
        server = net.createServer(function(connection) {
            console.log('Клиент подключен');

            connection.on('end', function() {
                console.log('Bye, Client!');
            });

            connection.write('Hello World, my client!\r\n');
            connection.pipe(connection);

            connection.on('error', function() {
                console.log('Возникла ошибка! Перезапускаю сервер...');
                if (server != null) {
                    server.close();
                    server = null;
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