const router = require('koa-router')()
const fs = require('fs')
const path = require('path')
const { sign } = require('jsonwebtoken')
const querySql = require('../connection').querySql

const ErrorMsg = {
  status: 200,
  message: '参数不合法'
}

router.post('/register', async function(ctx) {
  const data = ctx.request.body
  const username = data.username
  const password = data.password
  const againPassword = data.againPassword
  if (!username || !password) {
    ctx.body = ErrorMsg
    return
  } else if(password !== againPassword) {
    ErrorMsg.message = '两次输入密码不一致'
    ctx.body = ErrorMsg
    return
  }
  const result = await querySql(`INSERT INTO mysql_test.user VALUES(${null}, ${username}, ${password})`)
  ctx.body = result
})

router.post('/login', async function(ctx) {
  const data = ctx.request.body
  if (!data.username || !data.password) {
    ctx.body = ErrorMsg
    return
  }

  const userInfo = await querySql(`SELECT * FROM mysql_test.user WHERE username='${data.username}'&&'${data.password}'`)
  if (!userInfo.length) {
    ctx.body = {
      status: 200,
      message: '用户名或密码不正确'
    }
  } else {
    const token = sign({
      name: data.userName,
      _id: '1'
    }, 'my-secret', {expiresIn: '1h'})
  
    ctx.body = {
      code: 200,
      token: 'Bearer ' + token,
      message: '登录成功'
    }
  }
})

router.get('/api/getName', async function(ctx) {
  await querySql('SELECT * FROM mysql_test.coder').then(res => {
    ctx.body = JSON.stringify(res)
  }).catch(err => {
    ctx.body = err
  })

})

router.get('/api/getMenu', async function(ctx) {
  ctx.body = {
    msg: 'ok',
    data: [
      {
        name: '首页',
        path: '/home',
        id: '1',
        parentId: 0
      }, {
        name: '个人中心',
        path: '/me',
        id: '2',
        parentId: 0,
        children: [{
          name: '设置',
          path: '/setting',
          parentId: '2',
          id: '2-1'
        }, {
          nmae: '个人信息',
          path: '/info',
          parentId: '2',
          id: '2-2'
        }]
      }, {
        name: '抽奖中心',
        id: '3',
        path: '/luckDraw',
        parentId: 0
      }
    ]
  }
})

router.post('/api/upload', async function(ctx) {
  // 上传单个文件
  const file = ctx.request.files.file; // 获取上传文件
  // 创建可读流
  const reader = fs.createReadStream(file.path);
  let filePath = path.join(__dirname, '../upload/') + `${file.name}`;
  // 创建可写流
  const writeStream = fs.createWriteStream(filePath);
  // 可读流通过管道写入可写流
  reader.pipe(writeStream);
  return ctx.body = "上传成功！"
})


// 商品
router.post('/api/goods/add', async function(ctx) {
  const { name, imgUrl = null, goodsTxt = null, price } = ctx.request.body
  let msg = '新增成功'
  if (!name) {
    msg = '商品名称不能为空'
  } else if(!price) {
    msg = '商品价格不能为空'
  }
  const result = await querySql(`INSERT INTO mysql_test.goods VALUES(null, '${name}',${imgUrl},${goodsTxt},${price})`)
  if (result) {
    ctx.body = {
      status: 200,
      msg
    }
  }
})

// 商品列表
router.get('/api/goods/list', async function(ctx) {
  const { page = 0, pageSize = 10, name = '' } = ctx.request.query
  const startIndex = page === 0 ? 0 : (page - 1) * pageSize
  const result = await querySql(`SELECT * FROM mysql_test.goods WHERE name LIKE '%${name}%' LIMIT ${startIndex},${pageSize}`)
  const count = await querySql(`SELECT count(*) from mysql_test.goods`)
  ctx.body = {
    status: 200,
    data: {
      list: result,
      total: count[0]['count(*)']
    }
  }
})

module.exports = router
