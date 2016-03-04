module.exports.io = null;

module.exports = function (io) {
    module.exports.io = io;
    bind();
    return io;
}

function bind() {
    var io = module.exports.io;

    io.sockets.on('connection', function (socket) {
        socket.on('slide', function (data) {
            io.sockets.emit('slide', data);
        });

        socket.on('golive', function () {
            io.sockets.emit('golive');
        });

        socket.on('cheeky', function (data) {
            io.sockets.emit('cheeky', data);
        });

        socket.on('cheeky-preview', function (data) {
            socket.broadcast.emit('cheeky-preview', data);
        });

        socket.on('donation', function (data) {
            io.sockets.emit('donation', data);
        });

        socket.on('display-timer', function (data) {
          io.sockets.emit('timer-display', data);
        });

        socket.on('timer', function (data) {
            io.sockets.emit('timer', data);
        });
    });
}
