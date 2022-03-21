var net = require('net');
var client = null;

function clientConnect() {
    try {
        if (client == null) {
            console.log('client == null, создаю клиент');
            client = net.connect({port: 8080}, function() {
                console.log('Hello, server!');
                //client.destroy();
            });

            client.on('data', function(data) {
                console.log(data.toString());
                //client.end();
            });

            client.on('end', function() { 
                console.log('Bye, Server!');
                client.destroy();
            });

            client.on('destroy', function() {
                console.log('Socket destroy');
                client = null;
            });

            client.on('error', function() {
                console.log('Потеряна связь с сервером! Переподключаюсь');
                client = null;
                clientConnect();
            })
        }
    }
    catch(err) {
        console.log('ОШИБКА');
        return false;
    }

    return true;
}

try {
    if (client == null)
        clientConnect();
}
catch(err) {
    client = null;
    console.log('Потеряно соединение с сервером, переподключаюсь');
    clientConnect();
}