const colors = require('colors-console') // 调整console颜色
const Koa = require('koa') // 基于Node.js平台的web开发框架，为啥用它，够轻
const app = new Koa()
const path = require('path')
const http = require('http')
const WebSocket = require('ws')
const port = 3000

// 配置静态html展示
app.use(require('koa-static')(path.join(__dirname) + '/public'))

// 启动服务
const server = app.listen(port, () => {
    console.log(colors('green', `服务启动，访问地址：http://localhost:${port}`));
})

// 初始化websocket，并挂载到服务器上
const wss = new WebSocket.Server({
    server
})

// websocket连接api
wss.on('connection', (ws) => {
    console.log(colors('green', `websocket已连接`));

    // 连接上，就发送欢迎语
    ws.send('欢迎你丫！')

    // 监听客户端传过来的信息
    ws.on('message', function message(data) {
        // 拿到信息，请求第三方聊天api
        startRequest(data, ws)
    });

    // 监听WebSocket关闭
    ws.on('close', function open() {
        console.log('close');
    });

    // 监听WebSocket服务出错
    ws.on('error', console.error);
})

function startRequest(message, ws) {
    // 采用http模块向服务器发起一次get请求      
    http.get(`http://api.qingyunke.com/api.php?key=free&appid=0&msg=${encodeURI(message)}`, res => {
        // 防止中文乱码
        res.setEncoding('utf-8');
        // 监听data事件，每次取一块数据
        res.on('data', chunk => {
            ws.send(JSON.parse(chunk).content)
        });
    }).on('error', err => {
        ws.send('对不起，网络故障了')
    });
}