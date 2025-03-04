module.exports = {
  questions: {
    mysql: [
      {
        id: 1,
        categoryId: 1,
        title: "MySQL索引原理",
        difficulty: "中等",
        viewCount: 1520,
        description: "请详细说明MySQL中索引的工作原理，以及什么情况下索引会失效？",
        code: "",
        md: "# MySQL索引原理\n\n## 索引的工作原理\n\n1. B+树结构\n   - MySQL 使用 B+树作为索引的数据结构\n   - B+树的所有数据都存储在叶子节点\n   - 非叶子节点只存储索引键值\n\n2. 索引类型\n   - 主键索引（聚簇索引）\n   - 二级索引（非聚簇索引）\n   - 联合索引\n\n## 索引失效的情况\n\n\`\`\`sql\n-- 1. 使用函数或运算\nSELECT * FROM users WHERE YEAR(create_time) = 2024;\n\n-- 2. 不符合最左前缀原则\nSELECT * FROM users WHERE age = 20;  -- name,age的联合索引\n\n-- 3. 使用不等于或不包含\nSELECT * FROM users WHERE name != 'John';\n\n-- 4. 使用 OR 连接条件\nSELECT * FROM users WHERE name = 'John' OR age = 20;\n\`\`\`\n\n## 优化建议\n\n1. 合理使用联合索引\n2. 避免索引字段进行运算\n3. 控制索引数量\n4. 定期维护索引",
        tags: ["索引", "优化", "B+树"]
      },
      {
        "id": 2,
        "categoryId": 1,
        "title": "MySQL事务ACID特性",
        "difficulty": "中等",
        "viewCount": 2345,
        "description": "详细解释MySQL事务的ACID特性及其实现机制，并说明隔离级别如何影响事务并发控制？",
        "code": "",
        "md": "# MySQL事务ACID特性\n\n## 核心特性\n1. **原子性(Atomicity)**  \n   事务是不可分割的最小操作单元，通过`UNDO_LOG`实现回滚\n2. **一致性(Consistency)**  \n   事务执行前后数据库状态必须合法，由应用层和数据库共同保证\n3. **隔离性(Isolation)**  \n   通过MVCC和锁机制实现，支持四种隔离级别：\n   - 读未提交(READ UNCOMMITTED)\n   - 读已提交(READ COMMITTED)\n   - 可重复读(REPEATABLE READ)\n   - 串行化(SERIALIZABLE)\n4. **持久性(Durability)**  \n   通过`REDO_LOG`和双写缓冲保证数据持久化\n\n## 隔离级别对比\n| 隔离级别       | 脏读 | 不可重复读 | 幻读 |\n|----------------|------|------------|------|\n| READ UNCOMMITTED | ✔️   | ✔️         | ✔️   |\n| READ COMMITTED   | ✖️   | ✔️         | ✔️   |\n| REPEATABLE READ  | ✖️   | ✖️         | ✔️   |\n| SERIALIZABLE     | ✖️   | ✖️         | ✖️   |\n\n## 并发问题示例\n```sql\n-- 脏读示例\nSET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;\nBEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE user_id = 1; -- 未提交\n-- 其他会话可读取未提交数据\n```",
        "tags": ["事务", "ACID", "隔离级别"]
      },
      {
          "id": 3,
          "categoryId": 1,
          "title": "MySQL锁机制解析",
          "difficulty": "困难",
          "viewCount": 1876,
          "description": "阐述MySQL中共享锁与排他锁的区别，分析死锁产生的条件及排查解决方法",
          "code": "",
          "md": "# MySQL锁机制\n\n## 锁类型对比\n| 锁类型       | 别名   | 兼容性               | 使用场景          |\n|--------------|--------|----------------------|-------------------|\n| 共享锁(S锁)  | 读锁   | 兼容其他共享锁       | SELECT ... LOCK IN SHARE MODE |\n| 排他锁(X锁)  | 写锁   | 不兼容任何锁         | UPDATE/DELETE/INSERT |\n\n## 死锁产生条件\n1. 互斥条件：资源只能被一个进程持有\n2. 请求与保持：持有资源的同时请求新资源\n3. 不可剥夺：资源只能自愿释放\n4. 循环等待：进程间形成资源请求环\n\n## 死锁排查\n```sql\n-- 查看当前锁信息\nSHOW ENGINE INNODB STATUS;  -- 查看LATEST DETECTED DEADLOCK\n\n-- 查看等待锁的进程\nSELECT * FROM information_schema.INNODB_TRX;\nSELECT * FROM information_schema.INNODB_LOCKS;\nSELECT * FROM information_schema.INNODB_LOCK_WAITS;\n\n-- 强制终止进程\nKILL [trx_mysql_thread_id];\n```\n\n## 预防策略\n1. 事务保持简短\n2. 按固定顺序访问资源\n3. 合理设置索引减少锁范围\n4. 使用`SELECT ... FOR UPDATE NOWAIT`[1](@ref)[4](@ref)",
          "tags": ["锁机制", "死锁", "InnoDB"]
      },
      {
          "id": 4,
          "categoryId": 1,
          "title": "SQL查询优化策略",
          "difficulty": "中等",
          "viewCount": 2987,
          "description": "列举常见的SQL查询性能优化方法，并解释EXPLAIN执行计划中各关键字段的含义",
          "code": "",
          "md": "# SQL查询优化\n\n## 优化策略\n1. **索引优化**  \n   使用覆盖索引(covering index)，避免`SELECT *`\n2. **查询重构**  \n   将复杂查询拆分为多个简单查询\n3. **避免全表扫描**  \n   对`WHERE`条件字段建立索引\n4. **分页优化**  \n   使用`WHERE id > [last_id] LIMIT n`代替`LIMIT m,n`\n\n## EXPLAIN关键字段\n| 字段          | 说明                          | 优化关注点          |\n|---------------|-------------------------------|---------------------|\n| type          | 访问类型(ALL/index/range等)   | 避免ALL类型         |\n| key           | 实际使用的索引                | 检查是否使用正确索引|\n| rows          | 预估扫描行数                  | 数值越大性能越差    |\n| Extra         | 附加信息                      | 注意Using filesort等|\n\n## 优化示例\n```sql\n-- 低效查询\nSELECT * FROM orders WHERE DATE(create_time) = '2025-03-02';\n\n-- 优化后\nSELECT * FROM orders \nWHERE create_time BETWEEN '2025-03-02 00:00:00' AND '2025-03-02 23:59:59';\n\n-- 执行计划分析\nEXPLAIN SELECT * FROM users WHERE age > 20;  -- 查看type是否为range\n```[1](@ref)[4](@ref)[6](@ref)",
          "tags": ["优化", "执行计划", "索引"]
      },
      {
        "id": 5,
        "categoryId": 1,
        "title": "MySQL存储引擎对比",
        "difficulty": "中等",
        "viewCount": 3120,
        "description": "详细对比InnoDB与MyISAM存储引擎的核心差异，并说明各自适用场景",
        "code": "",
        "md": "# MySQL存储引擎对比\n\n## InnoDB vs MyISAM\n| 特性                | InnoDB                     | MyISAM               |\n|---------------------|----------------------------|----------------------|\n| **事务支持**        | ✔️ 支持ACID                | ✖️ 不支持            |\n| **锁机制**          | 行级锁                     | 表级锁               |\n| **外键约束**        | ✔️ 支持                    | ✖️ 不支持            |\n| **崩溃恢复**        | 通过redo log实现           | 需手动修复表文件     |\n| **全文索引**        | MySQL 5.6+支持             | ✔️ 支持              |\n| **适用场景**        | 高并发写/事务型应用        | 读密集型/静态数据    |\n\n## 示例场景\n```sql\n-- 创建MyISAM表\nCREATE TABLE logs (\n    id INT PRIMARY KEY,\n    content TEXT\n) ENGINE=MyISAM;\n\n-- 创建InnoDB表\nCREATE TABLE orders (\n    order_id INT AUTO_INCREMENT PRIMARY KEY,\n    user_id INT,\n    FOREIGN KEY (user_id) REFERENCES users(id)\n) ENGINE=InnoDB;\n```\n[1](@ref)[4](@ref)[9](@ref)",
        "tags": ["存储引擎", "InnoDB", "MyISAM"]
      },
      {
        "id": 6,
        "categoryId": 1,
        "title": "MySQL主从复制原理",
        "difficulty": "中等",
        "viewCount": 2789,
        "description": "阐述MySQL主从复制的实现原理，并说明如何配置主从同步",
        "code": "",
        "md": "# MySQL主从复制\n\n## 核心流程\n1. **主库写binlog**：所有数据变更写入二进制日志\n2. **从库IO线程**：拉取主库binlog到本地relay log\n3. **从库SQL线程**：重放relay log中的事件\n\n## 配置步骤\n```sql\n-- 主库配置\n[mysqld]\nserver-id=1\nlog-bin=mysql-bin\n\n-- 从库配置\n[mysqld]\nserver-id=2\nrelay-log=mysql-relay\n\n-- 创建复制账号\nCREATE USER 'repl'@'%' IDENTIFIED BY 'password';\nGRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';\n\n-- 从库启动复制\nCHANGE MASTER TO\nMASTER_HOST='master_ip',\nMASTER_USER='repl',\nMASTER_PASSWORD='password',\nMASTER_LOG_FILE='mysql-bin.000001',\nMASTER_LOG_POS=154;\nSTART SLAVE;\n```\n[2](@ref)[4](@ref)[9](@ref)",
        "tags": ["主从复制", "高可用", "binlog"]
      },
      {
        "id": 7,
        "categoryId": 1,
        "title": "MySQL日志系统解析",
        "difficulty": "困难",
        "viewCount": 1987,
        "description": "解释MySQL中binlog、redo log、undo log的作用与区别",
        "code": "",
        "md": "# MySQL日志系统\n\n## 三大核心日志\n| 日志类型 | 作用                          | 写入时机           | 恢复用途          |\n|----------|-------------------------------|--------------------|-------------------|\n| binlog   | 记录所有数据变更（逻辑日志）  | 事务提交后         | 主从复制/数据恢复 |\n| redo log | 保证事务持久性（物理日志）    | 事务执行中         | 崩溃恢复          |\n| undo log | 实现事务回滚和MVCC（逻辑日志）| 数据修改前         | 事务回滚          |\n\n## 日志协作流程\n```mermaid\nflowchart LR\n    A[事务开始] --> B[生成undo log]\n    B --> C[修改内存数据页]\n    C --> D[写redo log(Prepare状态)]\n    D --> E[写binlog]\n    E --> F[提交事务写redo log(Commit状态)]\n```\n[4](@ref)[9](@ref)[5](@ref)",
        "tags": ["日志系统", "事务", "崩溃恢复"]
      },
      {
        "id": 10,
        "categoryId": 1,
        "title": "SQL执行流程解析",
        "difficulty": "中等",
        "viewCount": 2876,
        "description": "详细描述一条SQL查询在MySQL中的完整执行过程",
        "md": "# SQL执行流程\n\n## 核心步骤\n```mermaid\nflowchart TB\n    A[客户端] -->|SQL语句| B[连接器]\n    B --> C[查询缓存]\n    C -->|命中| D[直接返回结果]\n    C -->|未命中| E[解析器]\n    E --> F[预处理器]\n    F --> G[优化器]\n    G --> H[执行器]\n    H --> I[存储引擎]\n    I --> J[返回结果]\n```\n\n## 关键阶段说明\n1. **连接器**：管理连接，验证权限\n2. **查询缓存**：8.0+已移除该功能\n3. **解析器**：语法分析生成解析树\n4. **优化器**：选择最优执行计划\n5. **执行器**：调用存储引擎接口读写数据\n\n## 示例分析\n```sql\nEXPLAIN SELECT * FROM users WHERE age > 20;\n-- 查看type字段判断是否使用索引\n-- 检查rows字段预估扫描行数\n```\n[4](@ref)[9](@ref)[5](@ref)",
        "tags": ["执行流程", "查询优化", "解析器"]
      },
      {
        "id": 11,
        "categoryId": 1,
        "title": "分库分表策略",
        "difficulty": "困难",
        "viewCount": 1895,
        "description": "阐述MySQL分库分表的常见方案及适用场景",
        "md": "# 分库分表策略\n\n## 常用方案\n| 方案类型     | 实现方式                  | 优点                  | 缺点                  |\n|--------------|--------------------------|-----------------------|-----------------------|\n| 水平分表     | 按时间/范围分表           | 扩容方便              | 跨表查询复杂          |\n| 垂直分库     | 按业务拆分数据库          | 降低单库压力          | 事务跨库困难          |\n| 一致性哈希   | 虚拟节点分布              | 数据均衡              | 迁移成本高            |\n\n## 分片键选择原则\n1. 数据均匀分布\n2. 查询带分片键\n3. 避免跨分片事务\n\n## 示例配置\n```sql\n-- 使用ShardingSphere配置分表\nsharding:\n  tables:\n    user:\n      actualDataNodes: ds0.user_$->{0..3}\n      tableStrategy:\n        standard:\n          shardingColumn: user_id\n          shardingAlgorithmName: mod4\n```\n[9](@ref)[5](@ref)",
        "tags": ["分库分表", "高并发", "Sharding"]
      },
      {
        "id": 12,
        "categoryId": 1,
        "title": "慢查询优化方法",
        "difficulty": "中等",
        "viewCount": 3267,
        "description": "列举常见的慢查询优化手段并解释执行计划关键指标",
        "md": "# 慢查询优化\n\n## 优化步骤\n1. 开启慢查询日志\n   ```sql\n   SET GLOBAL slow_query_log = ON;\n   SET GLOBAL long_query_time = 2; -- 单位秒\n   ```\n2. 使用EXPLAIN分析\n   ```sql\n   EXPLAIN SELECT * FROM orders WHERE amount > 1000;\n   ```\n3. 关键指标解读\n   | 字段    | 优化关注点                  |\n   |---------|----------------------------|\n   | type    | ALL需优化为range/const     |\n   | key     | 是否使用正确索引           |\n   | rows    | 扫描行数越少越好           |\n   | Extra   | Using filesort需优化       |\n\n## 常见优化手段\n- 为WHERE条件字段添加索引\n- 避免在索引列上使用函数\n- 使用覆盖索引减少回表\n- 拆分大查询为多个小查询\n[4](@ref)[9](@ref)[1](@ref)",
        "tags": ["慢查询", "执行计划", "索引优化"]
    },
    {
        "id": 13,
        "categoryId": 1,
        "title": "数据库备份策略",
        "difficulty": "中等",
        "viewCount": 2150,
        "description": "对比物理备份与逻辑备份的差异，并说明常用备份工具的使用方法",
        "md": "# 数据库备份策略\n\n## 备份类型对比\n| 类型     | 工具       | 优点                  | 缺点                  |\n|----------|------------|-----------------------|-----------------------|\n| 逻辑备份 | mysqldump  | 兼容性好，可读性强    | 恢复慢，大库耗时      |\n| 物理备份 | xtrabackup | 备份/恢复快           | 存储空间占用大        |\n\n## 备份示例\n```bash\n# 逻辑备份\nmysqldump -uroot -p --single-transaction dbname > backup.sql\n\n# 物理备份\nxtrabackup --backup --user=root --password=123456 --target-dir=/backup/\n\n# 定时任务配置\n0 2 * * * /usr/bin/mysqldump -uroot -p123456 dbname | gzip > /backup/db_$(date +%F).sql.gz\n```\n[2](@ref)[5](@ref)[8](@ref)",
        "tags": ["备份恢复", "mysqldump", "xtrabackup"]
    },
    {
        "id": 14,
        "categoryId": 1,
        "title": "SQL注入防御",
        "difficulty": "中等",
        "viewCount": 2789,
        "description": "解释SQL注入原理及防范措施，并提供安全编码示例",
        "md": "# SQL注入防御\n\n## 攻击原理\n```sql\n-- 恶意输入: ' OR '1'='1\nSELECT * FROM users WHERE username='' OR '1'='1' AND password='...'\n```\n\n## 防御措施\n1. **参数化查询**\n   ```python\n   # Python示例\n   cursor.execute(\"SELECT * FROM users WHERE username = %s\", (user_input,))\n   ```\n2. **输入验证**\n   ```js\n   // 前端过滤特殊字符\n   const cleanInput = input.replace(/[^a-zA-Z0-9]/g, '');\n   ```\n3. **最小权限原则**\n   ```sql\n   CREATE USER 'webuser'@'%' IDENTIFIED BY 'strong_password';\n   GRANT SELECT, INSERT ON dbname.* TO 'webuser'@'%';\n   ```\n4. **Web防火墙**\n   - 使用ModSecurity等WAF产品\n[4](@ref)[9](@ref)[7](@ref)",
        "tags": ["安全", "SQL注入", "参数化查询"]
      }
    ],
    java: [
      {
        id: 3,
        categoryId: 2,
        title: "Java线程池原理",
        difficulty: "困难",
        viewCount: 2100,
        description: "请详细说明Java线程池的工作原理，以及常见的线程池类型有哪些？",
        code: "",
        md: ``,
        tags: ["线程池", "并发", "线程安全"]
      },
      {
        id: 4,
        categoryId: 2,
        title: "Java集合框架",
        difficulty: "中等",
        viewCount: 1800,
        description: "请详细介绍Java集合框架的主要类型和使用场景。",
        code: "",
        md: ``,
        tags: ["集合", "List", "Set", "Map"]
      },
      {
        "id": 5,
        "categoryId": 2,
        "title": "Hashtable与HashMap的区别",
        "difficulty": "中等",
        "viewCount": 1200,
        "description": "Hashtable和HashMap都是Java中的Map接口实现类，但它们在线程安全性、性能、null值支持等方面存在显著差异。",
        "code": "",
        "md": "### Hashtable与HashMap的区别\n\n#### 1. 线程安全\n- **Hashtable**：是线程安全的，所有方法都是同步的，适合多线程环境。\n- **HashMap**：不是线程安全的，需要外部同步机制来保证线程安全。\n\n#### 2. 性能\n- **Hashtable**：由于线程安全，性能相对较低。\n- **HashMap**：由于非线程安全，性能更高，更适合单线程环境。\n\n#### 3. Null值支持\n- **Hashtable**：不支持key和value为null，否则会抛出NullPointerException。\n- **HashMap**：允许key和value为null，但key为null时只能有一个。\n\n#### 4. 迭代器\n- **Hashtable**：使用`Enumeration`迭代，不支持`Iterator`。\n- **HashMap**：使用`Iterator`迭代，支持迭代器的`remove()`方法。\n\n#### 5. 底层实现\n- **Hashtable**：底层基于哈希表实现，使用双哈希算法解决冲突。\n- **HashMap**：底层基于哈希表和红黑树实现，性能更优。\n\n#### 6. 初始容量和加载因子\n- **Hashtable**：默认初始容量为11，加载因子为0.75。\n- **HashMap**：默认初始容量为16，加载因子为0.75，可以通过构造函数自定义。\n",
        "tags": ["集合", "Map", "Hashtable", "HashMap"]
      }
    ],
    ds: [
      {
        id: 5,
        categoryId: 3,
        title: "红黑树特性与实现",
        difficulty: "困难",
        viewCount: 1680,
        description: "请详细说明红黑树的特性，以及插入、删除操作的实现原理。",
        code: "",
        md: ``,
        tags: ["红黑树", "平衡树", "数据结构"]
      }
    ],
    redis: [
      {
        id: 1,
        categoryId: 4,
        title: "Redis持久化机制",
        difficulty: "中等",
        viewCount: 1890,
        description: "请详细说明Redis的RDB和AOF两种持久化机制的原理、优缺点及使用场景。",
        code: "",
        md: ``,
        tags: ["持久化", "RDB", "AOF"]
      },
      {
        "id": 5,
        "categoryId": 4,
        "title": "Redis数据类型与使用场景",
        "difficulty": "中等",
        "viewCount": 2850,
        "description": "详细说明Redis的5种核心数据类型及其典型应用场景",
        "code": "",
        "md": "# Redis核心数据类型\n\n## 数据结构对比\n| 类型       | 特性                          | 应用场景                  |\n|------------|-------------------------------|---------------------------|\n| String     | 二进制安全，最大512MB         | 缓存、计数器、分布式锁    |\n| Hash       | 键值对集合                    | 对象存储（用户信息等）    |\n| List       | 双向链表，支持阻塞操作        | 消息队列、最新消息列表    |\n| Set        | 无序唯一集合                  | 标签系统、共同好友        |\n| ZSet       | 有序唯一集合（按score排序）   | 排行榜、延迟队列          |\n\n## 示例场景\n```redis\n-- 排行榜实现（ZSET）\nZADD leaderboard 100 \"user1\"\nZADD leaderboard 85 \"user2\"\nZREVRANGE leaderboard 0 2 WITHSCORES\n```\n![数据结构示意图](https://example.com/redis-data-struct.png)",
        "tags": ["数据结构", "缓存设计"]
      },
      {
        "id": 6,
        "categoryId": 4,
        "title": "缓存穿透与解决方案",
        "difficulty": "中等",
        "viewCount": 3120,
        "description": "解释缓存穿透现象及其解决方案",
        "code": "",
        "md": "# 缓存穿透\n\n## 现象描述\n- 大量请求查询**不存在的数据**\n- 绕过缓存直接访问数据库\n\n## 解决方案\n1. **布隆过滤器**\n   ```python\n   # 初始化布隆过滤器\n   from pybloom_live import ScalableBloomFilter\n   bf = ScalableBloomFilter()\n   \n   # 数据预热时添加所有合法key\n   for key in valid_keys:\n       bf.add(key)\n   \n   # 查询前校验\n   if not key in bf:\n       return None\n   ```\n2. **空值缓存**\n   ```redis\n   SETEX empty_key 300 \"nil\"  # 缓存空值5分钟\n   ```\n3. **请求限流**\n\n## 对比方案\n| 方案            | 优点                | 缺点                |\n|----------------|--------------------|---------------------|\n| 布隆过滤器      | 内存占用低         | 存在误判率          |\n| 空值缓存        | 实现简单           | 可能存储大量无效key |\n\n![缓存穿透流程图](https://example.com/cache-penetration.png)",
        "tags": ["缓存穿透", "布隆过滤器"]
      },
      {
        "id": 7,
        "categoryId": 4,
        "title": "Redis持久化机制",
        "difficulty": "困难",
        "viewCount": 1980,
        "description": "对比RDB和AOF持久化机制，分析混合持久化优势",
        "code": "",
        "md": "# 持久化机制\n\n## RDB vs AOF\n| 特性         | RDB                      | AOF                      |\n|--------------|--------------------------|--------------------------|\n| 持久化方式   | 内存快照                 | 操作日志追加             |\n| 文件大小     | 小（压缩二进制）         | 大（文本格式）           |\n| 恢复速度     | 快                       | 慢                       |\n| 数据安全性   | 可能丢失最后一次快照数据 | 可配置同步频率（1秒/次） |\n\n## 混合持久化（Redis 4.0+）\n```conf\n# redis.conf配置\naof-use-rdb-preamble yes\n```\n- **存储结构**：RDB头 + AOF增量操作\n- **优势**：\n  1. 快速加载RDB部分\n  2. 保留AOF数据完整性\n\n![持久化流程图](https://example.com/redis-persistence.png)",
        "tags": ["持久化", "RDB", "AOF"]
      },
      {
        "id": 8,
        "categoryId": 4,
        "title": "Redis集群模式",
        "difficulty": "困难",
        "viewCount": 1670,
        "description": "说明Redis Cluster的分布式实现原理",
        "code": "",
        "md": "# Redis Cluster\n\n## 核心机制\n1. **数据分片**\n   - 16384个哈希槽（slot）\n   - 公式：`HASH_SLOT = CRC16(key) mod 16384`\n2. **节点通信**\n   - Gossip协议维护集群状态\n   - 每秒随机选取节点PING/PONG\n\n## 节点扩容\n```bash\n# 添加新节点\nredis-cli --cluster add-node new_host:port existing_host:port\n\n# 迁移槽位\nredis-cli --cluster reshard host:port\n```\n\n## 故障转移\n- 主节点下线时，从节点自动升级\n- 需要至少3个主节点保证高可用\n\n![集群架构图](https://example.com/redis-cluster.png)",
        "tags": ["集群", "分布式"]
      },
      {
        "id": 9,
        "categoryId": 4,
        "title": "内存淘汰策略",
        "difficulty": "中等",
        "viewCount": 1540,
        "description": "解释Redis的8种内存淘汰策略及适用场景",
        "code": "",
        "md": "# 内存淘汰策略\n\n## 策略列表\n| 策略                | 说明                          |\n|---------------------|-------------------------------|\n| noeviction          | 拒绝写入新数据（默认）        |\n| allkeys-lru         | 全体键中淘汰最近最少使用      |\n| allkeys-lfu         | 全体键中淘汰最不经常使用      |\n| allkeys-random      | 全体键随机淘汰                |\n| volatile-lru        | 仅淘汰带过期时间的键（LRU）   |\n| volatile-lfu        | 仅淘汰带过期时间的键（LFU）   |\n| volatile-random     | 过期键随机淘汰                |\n| volatile-ttl        | 淘汰剩余时间最短的键          |\n\n## 配置方法\n```conf\n# redis.conf\nmaxmemory-policy allkeys-lru\nmaxmemory 4gb\n```\n\n## 选型建议\n- 缓存场景：`allkeys-lru`\n- 持久化+缓存混合：`volatile-lru`\n\n![LRU算法示意图](https://example.com/lru-algo.png)",
        "tags": ["内存管理", "淘汰策略"]
      },
      {
        "id": 10,
        "categoryId": 4,
        "title": "分布式锁实现",
        "difficulty": "困难",
        "viewCount": 2890,
        "description": "基于Redis实现安全的分布式锁，需解决死锁问题",
        "code": "",
        "md": "# 分布式锁\n\n## 正确实现\n```lua\n-- 原子操作：加锁\nlocal key = KEYS[1]\nlocal value = ARGV[1]\nlocal ttl = ARGV[2]\n\nif redis.call('setnx', key, value) == 1 then\n    redis.call('expire', key, ttl)\n    return 1\nelse\n    return 0\nend\n```\n\n## 常见问题\n1. **误删锁**\n   - 解决方案：校验锁持有者\n   ```lua\n   if redis.call('get', key) == value then\n       redis.call('del', key)\n   end\n   ```\n2. **锁续期**\n   - 使用Redisson的watch dog机制\n\n## Redlock算法\n1. 向N个节点获取锁\n2. 多数节点获取成功才算成功\n3. 总耗时需小于锁有效期\n\n![锁流程](https://example.com/redis-lock.png)",
        "tags": ["分布式锁", "Redlock"]
      },
      {
        "id": 11,
        "categoryId": 4,
        "title": "缓存雪崩预防",
        "difficulty": "中等",
        "viewCount": 1760,
        "description": "如何预防大量缓存同时过期导致的雪崩问题？",
        "code": "",
        "md": "# 缓存雪崩\n\n## 现象\n- 大量缓存**同时失效**\n- 数据库瞬时压力激增\n\n## 解决方案\n1. **随机过期时间**\n   ```java\n   // 设置基础过期时间+随机值\n   int expireTime = 3600 + new Random().nextInt(600);\n   redisTemplate.opsForValue().set(key, value, expireTime);\n   ```\n2. **永不过期+后台更新**\n   - 逻辑过期时间字段\n   - 异步线程刷新缓存\n3. **熔断降级**\n   - Hystrix等工具限流\n\n## 架构优化\n![多级缓存架构](https://example.com/multi-level-cache.png)",
        "tags": ["缓存雪崩", "高可用"]
      },
      {
        "id": 12,
        "categoryId": 4,
        "title": "Pipeline批量操作",
        "difficulty": "中等",
        "viewCount": 1320,
        "description": "如何使用Pipeline提升Redis操作效率？",
        "code": "",
        "md": "# Pipeline\n\n## 原理对比\n| 方式       | 网络RTT次数 | 执行流程           |\n|------------|-------------|--------------------|\n| 普通模式   | N次（串行） | 发送命令->等待响应 |\n| Pipeline   | 1次         | 批量发送->批量接收 |\n\n## Java示例\n```java\nJedis jedis = new Jedis();\nPipeline p = jedis.pipelined();\n\nfor(int i=0; i<1000; i++){\n    p.set('key'+i, 'value'+i);\n}\n\np.sync();  // 批量执行\n```\n\n## 注意事项\n- 每次Pipeline不宜超过1MB数据\n- 避免在事务中使用Pipeline\n\n![Pipeline流程](https://example.com/pipeline-flow.png)",
        "tags": ["性能优化", "Pipeline"]
      },
      {
        "id": 13,
        "categoryId": 4,
        "title": "Redis事务与ACID",
        "difficulty": "困难",
        "viewCount": 1450,
        "description": "分析Redis事务与数据库ACID特性的异同",
        "code": "",
        "md": "# Redis事务\n\n## 事务执行\n```redis\nMULTI\nSET key1 100\nINCR key1\nEXEC  -- 输出：QUEUED, QUEUED, [OK, 101]\n```\n\n## ACID分析\n| 特性   | Redis实现                      | 传统数据库               |\n|--------|--------------------------------|--------------------------|\n| 原子性 | 命令队列整体执行               | 事务回滚保证             |\n| 一致性 | 无约束（依赖开发者）           | 外键、约束等机制         |\n| 隔离性 | 单线程执行无并发问题           | 多隔离级别               |\n| 持久性 | 依赖持久化配置                 | 事务日志保证             |\n\n## WATCH命令\n```redis\nWATCH balance\nbalance = GET balance\nif balance > 100:\n    MULTI\n    DECRBY balance 100\n    EXEC\nELSE:\n    UNWATCH\n```\n ![事务流程图](https://img-blog.csdnimg.cn/9ea3f03626974923b9849b77e1bec51d.png)",
        "tags": ["事务", "ACID"]
      },
      {
        "id": 14,
        "categoryId": 4,
        "title": "热Key问题处理",
        "difficulty": "困难",
        "viewCount": 1620,
        "description": "如何检测和解决Redis热Key引发的性能问题？",
        "code": "",
        "md": "# 热Key问题\n\n## 检测方法\n1. **监控工具**\n   - `redis-cli --hotkeys`\n   - 第三方监控平台\n2. **日志分析**\n   ```bash\n   # 统计命令调用次数\n   cat redis.log | awk '{print $5}' | sort | uniq -c | sort -nr\n   ```\n\n## 解决方案\n1. **本地缓存**\n   ```java\n   // Guava Cache实现二级缓存\n   Cache<String, Object> localCache = CacheBuilder.newBuilder()\n       .expireAfterWrite(10, TimeUnit.SECONDS)\n       .build();\n   ```\n2. **Key拆分**\n   ```redis\n   SET article:1:part1 data1\n   SET article:1:part2 data2\n   ```\n3. **随机后缀**\n   ```java\n   String key = 'hotkey_' + ThreadLocalRandom.current().nextInt(10);\n   ```\n\n![热Key处理架构](https://example.com/hotkey-solution.png)",
        "tags": ["热Key", "性能优化"]
      }    
    ],
    python: [
      {
        id: 7,
        categoryId: 5,
        title: "Python装饰器原理",
        difficulty: "中等",
        viewCount: 500,
        description: "请解释Python装饰器的工作原理，并给出常见的使用场景。",
        code: ``,
        md: ``,
        tags: ["装饰器", "函数式编程", "性能统计"]
      }
    ],
    golang: [
      {
        id: 1,
        categoryId: 6,
        title: "GoLang Map 并发",
        difficulty: "中等",
        viewCount: 500,
        description: "GoLang Map 是否并发安全?",
        code: ``,
        md: ``,
        tags: ["golang", "map", "并发"]
      },
      {
        id: 2,
        categoryId: 6,
        title: "GoLang 协程泄漏",
        difficulty: "中等",
        viewCount: 500,
        description: "协程泄漏的原因可能是什么？",
        code: `无`,
        md: ``,
        tags: ["golang", "Goroutine", "协程"]
      }
    ]
  }
}
