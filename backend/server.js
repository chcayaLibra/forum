const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const path = require('path')
const http = require('http')
const { Server } = require('socket.io')
const fs = require('fs')

const express = require('express')
const cors = require('cors')
const multer = require('multer')

const app = express()

// const options = {
//   key: fs.readFileSync('pem/key.pem'),
//   cert: fs.readFileSync('pem/cert.pem')
// }

// app.use(
//   cors({
//     origin: '自己的域名',
//     credentials: true
//   })
// )
app.use(cors())

app.get('/', (req, res) => {
  res.send('running')
})

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    // origin: '自己的域名',
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// 配置 multer 存储头像
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})
const upload = multer({ storage })

const SECRET_KEY = 'your_secret_key'

// 数据库连接
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: ''
})

db.connect((err) => {
  if (err) throw err
  console.log('数据库连接成功')
})

// 帖子接口
app.get('/post', (req, res) => {
  const userId = req.query.user_id || null
  const sql = `SELECT
    p.p_id,
    p.user_id,
    p_view_count,
    p_collect_count,
    p_share_count,
    p_comment_count,
    p_content,
    p_images,
    u.user_avatar,
    u.username,
    CASE
        WHEN ? IS NOT NULL AND EXISTS (SELECT 1 FROM collection c WHERE c.p_id = p.p_id AND c.user_id = ?)
        THEN 'true'
        ELSE 'false'
    END AS is_collect,
    CASE
        WHEN c.p_id IS NOT NULL THEN 'true'
        ELSE 'false'
    END AS is_current_user_collect,
    CASE
        WHEN ? IS NOT NULL AND EXISTS (SELECT 1 FROM follows f WHERE f.follow_id = p.user_id AND f.user_id = ?)
        THEN 'true'
        ELSE 'false'
    END AS is_followed_by_current_user
FROM
    post p
LEFT JOIN
    users u ON p.user_id = u.user_id
LEFT JOIN
    collection c ON p.p_id = c.p_id AND c.user_id = ?
WHERE
    p.is_public = 'true'
ORDER BY
    p.publish_time DESC;`

  db.query(sql, [userId, userId, userId, userId, userId], (err, result) => {
    if (err) {
      console.error('查询错误: ', err)
      return res.status(500).json({
        code: 1,
        message: '查询错误',
        error: err.message
      })
    }

    res.json({
      code: 0,
      message: '请求成功',
      data: result
    })
  })
})

// 帖子详情接口
app.post('/post/detail', (req, res) => {
  const { p_id, user_id } = req.body
  const sql = `select p.p_id, p.user_id, p_view_count, p_collect_count, p_share_count, p_comment_count, p_content, p_images, user_avatar, username, is_public,
            CASE WHEN ? IS NOT NULL AND EXISTS (SELECT 1 FROM collection c WHERE c.p_id = p.p_id AND c.user_id = ?) 
            THEN 'true' ELSE 'false' END AS is_collect,
        CASE 
        WHEN c.p_id IS NOT NULL THEN 'true'
        ELSE 'false'
    END AS is_current_user_collect,
    CASE
        WHEN ? IS NOT NULL AND EXISTS (SELECT 1 FROM follows f WHERE f.follow_id = p.user_id AND f.user_id = ?)
        THEN 'true'
        ELSE 'false'
    END AS is_followed_by_current_user
FROM post p left join users u on p.user_id = u.user_id LEFT JOIN 
    collection c ON p.p_id = c.p_id AND c.user_id = ? where p.p_id = ?`
  db.query(sql, [user_id, user_id, user_id, user_id, user_id, p_id], (err, result) => {
    if (err) {
      console.error('数据库查询错误:', err) // 记录错误日志
      return res.status(500).json({
        // 返回错误响应
        code: 1,
        message: '数据库查询错误',
        error: err.message
      })
    }

    if (result.length === 0) {
      return res.status(404).json({
        code: 2,
        message: '未找到对应id的post'
      })
    }

    res.json({
      code: 0,
      message: '请求成功',
      data: result
    })
  })
})

// 发送评论接口
app.post('/post/comments', (req, res) => {
  const { user_id, p_id, c_content } = req.body

  // 检查数据是否完整
  if (!user_id || !p_id || !c_content) {
    return res.status(400).json({ error: '参数不完整' })
  }

  const sql = 'INSERT INTO comments (user_id, p_id, c_content) VALUES (?, ?, ?)'
  const values = [user_id, p_id, c_content]

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: '插入失败' })
    }

    res.status(201).json({
      code: 0,
      message: '评论成功',
      comment_id: result.insertId
    })
  })
})

// 请求评论列表接口
app.get('/post/comments/:p_id', (req, res) => {
  const p_id = req.params.p_id
  const sql =
    'SELECT comment_id, c.user_id, c.p_id, c_content, created_time, u.user_avatar, u.username from comments c LEFT JOIN post p on c.p_id = p.p_id LEFT JOIN users u on c.user_id = u.user_id where c.p_id = ? ORDER BY created_time desc;'

  db.query(sql, [p_id], (err, result) => {
    if (err) {
      console.error('数据库查询错误:', err) // 记录错误日志
      return res.status(500).json({
        // 返回错误响应
        code: 1,
        message: '数据库查询错误',
        error: err.message
      })
    }

    // if (result.length === 0) {
    //   return res.status(404).json({
    //     code: 2,
    //     message: '未找到对应id的comments'
    //   })
    // }

    res.json({
      code: 0,
      message: '请求成功',
      data: result
    })
  })
})

// 浏览数接口
app.patch('/post/view/:id', (req, res) => {
  const { id } = req.params

  const getSql = 'SELECT p_view_count FROM post WHERE p_id = ?'

  db.query(getSql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: '查询失败' })

    if (result.length === 0) {
      return res.status(404).json({ message: '帖子不存在' })
    }

    const currentViews = +result[0].p_view_count

    const updateSql = 'UPDATE post SET p_view_count = ? WHERE p_id = ?'
    db.query(updateSql, [currentViews + 1, id], (err) => {
      if (err) {
        return res.status(500).json({ error: '更新失败' })
      }

      res.json({
        code: 0,
        message: `帖子 ${id} 浏览量已更新为 ${currentViews + 1}`
      })
    })
  })
})

// 登录接口（用户名或邮箱）
app.post('/login', async (req, res) => {
  const { input, password } = req.body

  // 判断输入的是邮箱还是用户名
  // const field = input.includes('@') ? 'email' : 'username'
  console.log(input, password)
  const field = (input?.toString() || '').includes('@') ? 'user_email' : 'username'
  const sql = `SELECT * FROM users WHERE ${field} = ?`

  db.query(sql, [input], async (err, result) => {
    if (err) return res.status(500).send('数据库查询失败')

    if (result.length === 0) {
      return res.status(401).send('用户不存在')
    }

    const user = result[0]
    const userId = user.user_id
    // console.log(user)

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.user_password)

    if (!isMatch) {
      return res.status(401).send('密码错误')
    }

    // 生成 Token
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
      expiresIn: '10s'
    })

    res.json({ code: 0, token, userId })
  })
})

// 注册接口
app.post('/register', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).send('邮箱和密码不能为空')
  }

  try {
    //  1️ 检查邮箱是否重复
    db.query(`SELECT * FROM users WHERE user_email = ?`, [email], async (err, result) => {
      if (err) {
        console.error('查询失败:', err)
        return res.status(500).send('服务器错误')
      }

      if (result.length > 0) {
        return res.status(400).json({ code: 1, message: '邮箱已存在' })
      }

      //  2️ 查询当前最大 ID
      db.query(`SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1`, async (err, rows) => {
        if (err) {
          console.error('查询最大ID失败:', err)
          return res.status(500).send('服务器错误')
        }

        let nextId

        if (rows.length === 0) {
          nextId = 'u00000' // 第一个用户
        } else {
          const lastId = rows[0].user_id // 上一个 ID
          const num = parseInt(lastId.slice(1)) + 1 // 去掉 'u' 转为数字
          nextId = `u${num.toString().padStart(5, '0')}`
        }

        //  3️ 密码加密
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //  4️ 插入新用户
        const insertSql = `
                  INSERT INTO users (user_id, user_email, username, user_password)
                  VALUES (?, ?, '默认名字', ?)
              `

        db.query(insertSql, [nextId, email, hashedPassword], (err, result) => {
          if (err) {
            console.error('插入失败:', err)
            return res.status(500).send('服务器错误')
          }
          res.status(201).json({ code: 0, message: '注册成功' })
        })
      })
    })
  } catch (error) {
    console.error('注册失败:', error)
    res.status(500).send('服务器错误')
  }
})

// 用户信息接口
app.post('/users/info', (req, res) => {
  const { userId, followId } = req.body
  const sql = `select u.user_id, username, user_avatar, user_email, registration_time, follows, fans, background_img, sex, signature,
        CASE
        WHEN ? IS NOT NULL AND EXISTS (SELECT 1 FROM follows f WHERE f.follow_id = u.user_id AND f.user_id = ?)
        THEN 'true'
        ELSE 'false'
    END AS is_followed_by_current_user
     from users u where u.user_id = ?`

  db.query(sql, [userId, userId, followId], (err, result) => {
    if (err) {
      console.error('数据库查询错误:', err) // 记录错误日志
      return res.status(500).json({
        // 返回错误响应
        code: 1,
        message: '数据库查询错误',
        error: err.message
      })
    }

    if (result.length === 0) {
      return res.status(404).json({
        code: 2,
        message: '未找到对应id的user'
      })
    }

    res.json({
      code: 0,
      message: '请求成功',
      data: result
    })
  })
})

// 查询用户帖子接口
app.post('/users/posts', (req, res) => {
  const { userId, followId } = req.body
  const sql = `select p.p_id, p.user_id, p_view_count, p_collect_count, p_share_count, p_comment_count, p_content, p_images, user_avatar, username, is_public,
           CASE WHEN ? IS NOT NULL AND EXISTS (SELECT 1 FROM collection c WHERE c.p_id = p.p_id AND c.user_id = ?) 
            THEN 'true' ELSE 'false' END AS is_collect,
        CASE 
        WHEN c.p_id IS NOT NULL THEN 'true'
        ELSE 'false'
    END AS is_current_user_collect,
        CASE
        WHEN ? IS NOT NULL AND EXISTS (SELECT 1 FROM follows f WHERE f.follow_id = p.user_id AND f.user_id = ?)
        THEN 'true'
        ELSE 'false'
    END AS is_followed_by_current_user
FROM post p left join users u on p.user_id =u.user_id LEFT JOIN 
    collection c ON p.p_id = c.p_id AND c.user_id = ? where p.user_id = ? order by publish_time desc`

  db.query(sql, [userId, userId, userId, userId, userId, followId], (err, result) => {
    if (err) {
      console.error('查询错误: ', err)
      return res.status(500).json({
        code: 1,
        message: '查询错误',
        error: err.message
      })
    }

    res.json({
      code: 0,
      message: '请求成功',
      data: result
    })
  })
})

// 用户信息更新
app.post('/update', upload.fields([{ name: 'avatar' }, { name: 'bgImg' }]), (req, res) => {
  const { username, sex, signature, user_id } = req.body
  const files = req.files

  const avatarPaths = []
  const bgImgPaths = []
  if (files.avatar) {
    avatarPaths.push(`/uploads/${files.avatar[0].filename}`)
  }

  if (files.bgImg) {
    bgImgPaths.push(`/uploads/${files.bgImg[0].filename}`)
  }

  // 构建 SQL 更新语句
  let sql = 'UPDATE users SET username = ?, sex = ?, signature = ?,'
  const values = [username, sex, signature]

  if (avatarPaths[0]) {
    sql += ' user_avatar = ?,'
    values.push(avatarPaths[0])
  }

  if (bgImgPaths[0]) {
    sql += ' background_img = ?,'
    values.push(bgImgPaths[0])
  }

  sql = sql.replace(/,$/, '') // 去掉多余的逗号
  sql += ' WHERE user_id = ?' // 指定用户 ID
  values.push(user_id) // 假设修改用户 ID 为 1

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('更新失败:', err)
      return res.status(500).json({ code: 1, msg: '更新失败' })
    }
    res.json({ code: 0, msg: '更新成功' })
  })
})

// 发送帖子接口
app.post('/publish', upload.array('p_images', 9), (req, res) => {
  const { userId, content, isPublic } = req.body
  if (!userId) {
    return res.status(400).send('用户ID为空')
  }
  if (!content) {
    return res.status(400).send('内容为空')
  }

  const imagePath = req.files?.map((file) => `/uploads/${file.filename}`) || []

  const images = JSON.stringify(imagePath)

  db.query(`SELECT p_id FROM post ORDER BY p_id DESC LIMIT 1`, async (err, rows) => {
    if (err) {
      console.error('查询最大ID失败:', err)
      return res.status(500).send('服务器错误')
    }

    let nextId

    if (rows.length === 0) {
      nextId = 'p00000' // 第一个用户
    } else {
      const lastId = rows[0].p_id // 上一个 ID
      const num = parseInt(lastId.slice(1)) + 1 // 去掉 'u' 转为数字
      nextId = `p${num.toString().padStart(5, '0')}`
    }

    //  4️ 插入新帖子
    const insertSql = `
              INSERT INTO post (p_id, user_id, p_content, p_images, is_public)
              VALUES (?, ?, ?, ?, ?)
          `

    db.query(insertSql, [nextId, userId, content, images, isPublic], (err, result) => {
      if (err) {
        console.error('发布失败:', err)
        return res.status(500).send('服务器错误')
      }
      res.status(201).json({ code: 0, message: '发布成功' })
    })
  })
})

// 用户收藏帖子接口
app.post('/user/collect/', (req, res) => {
  const { userId, followId } = req.body
  const sql = `SELECT 
    p.p_id, 
    p.user_id, 
    p.p_view_count, 
    p.p_collect_count, 
    p.p_share_count, 
    p.p_comment_count, 
    p.p_content, 
    p.p_images, 
    u.user_avatar, 
    u.username, 
    p.is_public, 
    'true' AS is_collect,
    CASE 
        WHEN c2.p_id IS NOT NULL THEN 'true'
        ELSE 'false'
    END AS is_current_user_collect,
    CASE
        WHEN ? IS NOT NULL AND EXISTS (SELECT 1 FROM follows f WHERE f.follow_id = p.user_id AND f.user_id = ?)
        THEN 'true'
        ELSE 'false'
    END AS is_followed_by_current_user
FROM 
    collection c 
LEFT JOIN 
    post p ON c.p_id = p.p_id 
LEFT JOIN 
    users u ON p.user_id = u.user_id 
LEFT JOIN 
    collection c2 ON c2.p_id = c.p_id AND c2.user_id = ?
WHERE 
    p.is_public = 'true' 
    AND c.user_id = ?
ORDER BY 
    c.collect_time DESC;`

  db.query(sql, [userId, userId, userId, followId], (err, result) => {
    if (err) {
      console.error('查询错误: ', err)
      return res.status(500).json({
        code: 1,
        message: '查询错误',
        error: err.message
      })
    }

    res.json({
      code: 0,
      message: '请求成功',
      data: result
    })
  })
})

// 添加用户收藏接口
app.post('/post/collect/add', (req, res) => {
  const { user_id, p_id } = req.body

  // 检查数据是否完整
  if (!user_id || !p_id) {
    return res.status(400).json({ error: '参数不完整' })
  }

  const sql = 'INSERT INTO collection (user_id, p_id) VALUES (?, ?)'
  const values = [user_id, p_id]

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: '插入失败' })
    }

    res.status(201).json({
      code: 0,
      message: '收藏成功'
    })
  })
})

// 删除用户收藏接口
app.delete('/post/collect/del', (req, res) => {
  const { user_id, p_id } = req.body

  // 检查数据是否完整
  if (!user_id) {
    return res.status(400).json({ error: 'user_id不完整' })
  }
  if (!p_id) {
    return res.status(400).json({ error: 'p_id不完整' })
  }

  const sql = 'delete from collection where user_id = ? and p_id = ?'
  const values = [user_id, p_id]

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: '删除失败' })
    }

    res.status(201).json({
      code: 0,
      message: '取消收藏成功'
    })
  })
})

// 搜索接口
app.post('/post/search', (req, res) => {
  const { userId, searchContent } = req.body
  const sql = `SELECT p.p_id, p.user_id, p_view_count, p_collect_count, p_share_count, p_comment_count, p_content, p_images, user_avatar, username,
       CASE WHEN ? IS NOT NULL AND EXISTS (SELECT 1 FROM collection c WHERE c.p_id = p.p_id AND c.user_id = ?) 
            THEN 'true' ELSE 'false' END AS is_collect,
        CASE 
        WHEN c.p_id IS NOT NULL THEN 'true'
        ELSE 'false'
    END AS is_current_user_collect
FROM post p left join users u on p.user_id = u.user_id LEFT JOIN 
    collection c ON p.p_id = c.p_id AND c.user_id = ? where is_public = 'true' and p_content LIKE ? order by publish_time desc;`
  const formatSearchContent = `%${searchContent}%`

  db.query(sql, [userId, userId, userId, formatSearchContent], (err, result) => {
    if (err) {
      console.error('查询错误: ', err)
      return res.status(500).json({
        code: 1,
        message: '查询错误',
        error: err.message
      })
    }

    res.json({
      code: 0,
      message: '请求成功',
      data: result
    })
  })
})

// 删除用户帖子接口
app.delete('/user/post/del', (req, res) => {
  const { user_id, p_id } = req.body

  // 检查数据是否完整
  if (!user_id) {
    return res.status(400).json({ error: 'user_id不完整' })
  }
  if (!p_id) {
    return res.status(400).json({ error: 'p_id不完整' })
  }

  const sql = 'delete from post where user_id = ? and p_id = ?'
  const values = [user_id, p_id]

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: '删除失败' })
    }

    res.status(201).json({
      code: 0,
      message: '删除成功'
    })
  })
})

// 设置用户帖子公开
app.patch('/post/public/true/:p_id', (req, res) => {
  const { p_id } = req.params

  const sql = `update post set is_public = 'true' where p_id = ?`

  db.query(sql, [p_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: '更新失败' })
    }

    res.json({
      code: 0,
      message: '公开成功'
    })
  })
})

// 设置用户帖子非公开
app.patch('/post/public/false/:p_id', (req, res) => {
  const { p_id } = req.params

  const sql = `update post set is_public = 'false' where p_id = ?`

  db.query(sql, [p_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: '更新失败' })
    }

    res.json({
      code: 0,
      message: '取消公开成功'
    })
  })
})

// 查询所有用户
app.get('/users', (req, res) => {
  const userId = req.query.user_id || null
  const sql = `SELECT * from users`

  db.query(sql, (err, result) => {
    if (err) {
      console.error('查询错误: ', err)
      return res.status(500).json({
        code: 1,
        message: '查询错误',
        error: err.message
      })
    }

    res.json({
      code: 0,
      message: '请求成功',
      data: result
    })
  })
})

// 用户好友接口
app.post('/friend', (req, res) => {
  const userId = req.body.user_id || null
  const sql = `SELECT
    f1.user_id,
    f1.follow_id,
    u.username,
    u.user_avatar
FROM
    follows f1
INNER JOIN
    follows f2 ON f1.follow_id = f2.user_id AND f2.follow_id = ?
LEFT JOIN
    users u ON f1.follow_id = u.user_id
WHERE
    f1.user_id = ?`

  db.query(sql, [userId, userId], (err, result) => {
    if (err) {
      console.error('查询错误: ', err)
      return res.status(500).json({
        code: 1,
        message: '查询错误',
        error: err.message
      })
    }

    res.json({
      code: 0,
      message: '请求成功',
      data: result
    })
  })
})

// 添加关注接口
app.post('/follow/add', (req, res) => {
  const { userId, followId } = req.body
  const sql = `insert into follows(user_id, follow_id)
value (?, ?)`

  db.query(sql, [userId, followId], (err, result) => {
    if (err) {
      console.error('添加失败: ', err)
      return res.status(500).json({
        code: 1,
        message: '添加失败',
        error: err.message
      })
    }

    res.json({
      code: 0,
      message: '添加成功',
      data: result
    })
  })
})

// 取消关注接口
app.delete('/follow/del', (req, res) => {
  const { userId, followId } = req.body
  const sql = `delete from follows where user_id = ? and follow_id = ?`

  db.query(sql, [userId, followId], (err, result) => {
    if (err) {
      console.error('删除失败: ', err)
      return res.status(500).json({
        code: 1,
        message: '删除失败',
        error: err.message
      })
    }

    res.json({
      code: 0,
      message: '删除成功',
      data: result
    })
  })
})

// 聊天
let users = {}

// 登录时绑定 socket id
io.on('connection', (socket) => {
  console.log('连接:', socket.id)

  socket.on('login', (username) => {
    users[username] = socket.id
    console.log(`${username} 登录，绑定到 ${socket.id}`)
  })

  socket.on('sendMessage', ({ from, to, message }) => {
    db.query('INSERT INTO messages (sender, receiver, content, is_read) VALUES (?, ?, ?, FALSE)', [
      from,
      to,
      message
    ])

    const toSocketId = users[to]
    if (toSocketId) {
      io.to(toSocketId).emit('receiveMessage', { from, message })
    }
  })

  socket.on('disconnect', () => {
    for (let username in users) {
      if (users[username] === socket.id) {
        delete users[username]
        console.log(`${username} 断开连接`)
        break
      }
    }
  })
})

// 好友列表 -725

// 获取聊天记录
app.get('/chat/history', (req, res) => {
  const { userId, followId } = req.query
  // console.log(req.query)
  const sql = `SELECT * FROM messages WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?) ORDER BY created_at`

  db.query(sql, [userId, followId, followId, userId], (err, result) => {
    if (err) {
      console.error('查询失败: ', err)
      return res.status(500).json({
        code: 1,
        message: '查询失败',
        error: err.message
      })
    }

    res.json({
      code: 0,
      message: '查询成功',
      data: result
    })
  })
})

// 获取未读消息统计
app.get('/chat/unread/:followId', (req, res) => {
  const { followId } = req.params
  const sql = `SELECT sender, COUNT(*) AS count FROM messages WHERE receiver = ? AND is_read = FALSE GROUP BY sender`

  db.query(sql, [followId], (err, result) => {
    if (err) {
      console.error('查询失败: ', err)
      return res.status(500).json({
        code: 1,
        message: '查询失败',
        error: err.message
      })
    }

    res.json({
      code: 0,
      message: '查询成功',
      data: result
    })
  })
})

// 标记为已读
app.post('/chat/mark-as-read', (req, res) => {
  const { from, to } = req.body
  const sql =
    'UPDATE messages SET is_read = TRUE WHERE sender = ? AND receiver = ? AND is_read = FALSE'

  db.query(sql, [from, to], (err, result) => {
    if (err) {
      console.error('查询失败: ', err)
      return res.status(500).json({
        code: 1,
        message: '查询失败',
        error: err.message
      })
    }

    res.json({
      code: 0,
      message: '查询成功',
      data: result,
      success: true
    })
  })
})

// 搜索用户接口
app.post('/user/search', async (req, res) => {
  const { username } = req.body

  const sql = `SELECT username, user_avatar, user_id FROM users WHERE username like ?`

  const formatSearchContent = `%${username}%`

  db.query(sql, [formatSearchContent], async (err, result) => {
    if (err) return res.status(500).send('数据库查询失败')

    res.json({
      code: 0,
      message: '查询成功',
      data: result
    })
  })
})

// 验证 Token 中间件
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(403).send('未提供 Token')
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).send('Token 无效')
    req.user = decoded // 将解析后的用户信息存入 req
    next()
  })
}

// 受保护接口
app.get('/api/data', verifyToken, (req, res) => {
  res.json({ message: '这是受保护数据', user: req.user })
})

server.listen(3000, () => {
  console.log(`服务器运行在 http://localhost:3000`)
})
