from core import socketio, app

if __name__ == '__main__':
    socketio.run(app, host="127.0.0.1", port="8088")
    # app.run(debug=True)
