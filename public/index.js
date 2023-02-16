let ws = new WebSocketCustom() // 初始化socket对象

// 处理在线离线
document.querySelector('#online').addEventListener('click', (e) => {
    if (e.target.textContent == '在线中') {
        ws.close()
    } else if (e.target.textContent == '已离线') {
        ws = new WebSocketCustom()
    } else {
        ws = new WebSocketCustom()
    }
})

// 发布消息
document.querySelector('#send').addEventListener('click', (e) => {
    const str = document.querySelector('#input').value
    if (!str) return false
    ws.send(str)
    insertItem('my', str)
    document.querySelector('#send').innerText = '回复中...'
    document.querySelector('#send').setAttribute('disabled', true)
    document.querySelector('#input').setAttribute('disabled', true)
    document.querySelector('#input').value = ''
})

/**
 * 连接WebSocket方法
 * @returns 
 */
function WebSocketCustom() {
    let wsCustom = new WebSocket('ws://localhost:3000')
    // 连接建立时触发
    wsCustom.onopen = () => {
        console.log('WebSocket open');
        document.querySelector('#online').textContent = '在线中'
        document.querySelector('#send').removeAttribute('disabled')
        document.querySelector('#input').removeAttribute('disabled')
    }

    // 连接关闭时触发
    wsCustom.onclose = () => {
        console.log('WebSocket close');
        document.querySelector('#online').textContent = '已离线'
        document.querySelector('#send').setAttribute('disabled', true)
        document.querySelector('#input').setAttribute('disabled', true)
    }

    // 通信发生错误时触发
    wsCustom.onerror = () => {
        console.log('WebSocket error');
        document.querySelector('#online').textContent = '系统故障'
        document.querySelector('#send').setAttribute('disabled', true)
        document.querySelector('#input').setAttribute('disabled', true)
    }

    // 客户端接收服务端数据时触发
    wsCustom.onmessage = (ms) => {
        insertItem('robot', ms.data)
        document.querySelector('#send').innerText = '发送信息'
        document.querySelector('#send').removeAttribute('disabled')
        document.querySelector('#input').removeAttribute('disabled')
    }
    return wsCustom
}

/**
 * 插入聊天记录
 * @param {string} type my：我自己 robot：机器人
 * @param {string} str 发送的内容
 */
function insertItem(type, str) {
    const item = document.createElement('div')
    if (type == 'my') {
        item.setAttribute('class', 'item my')
    } else {
        item.setAttribute('class', 'item robot')
    }
    const img = document.createElement('img')
    if (type == 'my') {
        img.src = 'images/my.png'
    } else {
        img.src = 'images/robot.png'
    }
    img.setAttribute('class', 'item-left')
    const div = document.createElement('div')
    div.setAttribute('class', 'item-right')
    div.innerText = str
    item.appendChild(img)
    item.appendChild(div)
    document.querySelector('#content').appendChild(item)
    document.getElementById('view').scrollTo(0, document.getElementById('content').clientHeight);
}