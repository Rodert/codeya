module.exports = {
  questions: {
    mysql: [
      {
        id: 1,
        categoryId: "mysql",
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
        "categoryId": "mysql",
        "title": "MySQL事务ACID特性MySQL事务ACID特性MySQL事务ACID特性MySQL事务ACID特性",
        "difficulty": "中等",
        "viewCount": 2345,
        "description": "详细解释MySQL事务的ACID特性及其实现机制，并说明隔离级别如何影响事务并发控制？",
        "code": "",
        "md": "# MySQL事务ACID特性\n\n## 核心特性\n1. **原子性(Atomicity)**  \n   事务是不可分割的最小操作单元，通过`UNDO_LOG`实现回滚\n2. **一致性(Consistency)**  \n   事务执行前后数据库状态必须合法，由应用层和数据库共同保证\n3. **隔离性(Isolation)**  \n   通过MVCC和锁机制实现，支持四种隔离级别：\n   - 读未提交(READ UNCOMMITTED)\n   - 读已提交(READ COMMITTED)\n   - 可重复读(REPEATABLE READ)\n   - 串行化(SERIALIZABLE)\n4. **持久性(Durability)**  \n   通过`REDO_LOG`和双写缓冲保证数据持久化\n\n## 隔离级别对比\n| 隔离级别       | 脏读 | 不可重复读 | 幻读 |\n|----------------|------|------------|------|\n| READ UNCOMMITTED | ✔️   | ✔️         | ✔️   |\n| READ COMMITTED   | ✖️   | ✔️         | ✔️   |\n| REPEATABLE READ  | ✖️   | ✖️         | ✔️   |\n| SERIALIZABLE     | ✖️   | ✖️         | ✖️   |\n\n## 并发问题示例\n```sql\n-- 脏读示例\nSET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;\nBEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE user_id = 1; -- 未提交\n-- 其他会话可读取未提交数据\n```",
        "tags": ["事务", "ACID", "隔离级别"]
      },
      {
          "id": 3,
          "categoryId": "mysql",
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
          "categoryId": "mysql",
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
        "categoryId": "mysql",
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
        "categoryId": "mysql",
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
        "categoryId": "mysql",
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
        "categoryId": "mysql",
        "title": "SQL执行流程解析",
        "difficulty": "中等",
        "viewCount": 2876,
        "description": "详细描述一条SQL查询在MySQL中的完整执行过程",
        "md": "# SQL执行流程\n\n## 核心步骤\n```mermaid\nflowchart TB\n    A[客户端] -->|SQL语句| B[连接器]\n    B --> C[查询缓存]\n    C -->|命中| D[直接返回结果]\n    C -->|未命中| E[解析器]\n    E --> F[预处理器]\n    F --> G[优化器]\n    G --> H[执行器]\n    H --> I[存储引擎]\n    I --> J[返回结果]\n```\n\n## 关键阶段说明\n1. **连接器**：管理连接，验证权限\n2. **查询缓存**：8.0+已移除该功能\n3. **解析器**：语法分析生成解析树\n4. **优化器**：选择最优执行计划\n5. **执行器**：调用存储引擎接口读写数据\n\n## 示例分析\n```sql\nEXPLAIN SELECT * FROM users WHERE age > 20;\n-- 查看type字段判断是否使用索引\n-- 检查rows字段预估扫描行数\n```\n[4](@ref)[9](@ref)[5](@ref)",
        "tags": ["执行流程", "查询优化", "解析器"]
      },
      {
        "id": 11,
        "categoryId": "mysql",
        "title": "分库分表策略",
        "difficulty": "困难",
        "viewCount": 1895,
        "description": "阐述MySQL分库分表的常见方案及适用场景",
        "md": "# 分库分表策略\n\n## 常用方案\n| 方案类型     | 实现方式                  | 优点                  | 缺点                  |\n|--------------|--------------------------|-----------------------|-----------------------|\n| 水平分表     | 按时间/范围分表           | 扩容方便              | 跨表查询复杂          |\n| 垂直分库     | 按业务拆分数据库          | 降低单库压力          | 事务跨库困难          |\n| 一致性哈希   | 虚拟节点分布              | 数据均衡              | 迁移成本高            |\n\n## 分片键选择原则\n1. 数据均匀分布\n2. 查询带分片键\n3. 避免跨分片事务\n\n## 示例配置\n```sql\n-- 使用ShardingSphere配置分表\nsharding:\n  tables:\n    user:\n      actualDataNodes: ds0.user_$->{0..3}\n      tableStrategy:\n        standard:\n          shardingColumn: user_id\n          shardingAlgorithmName: mod4\n```\n[9](@ref)[5](@ref)",
        "tags": ["分库分表", "高并发", "Sharding"]
      },
      {
        "id": 12,
        "categoryId": "mysql",
        "title": "慢查询优化方法",
        "difficulty": "中等",
        "viewCount": 3267,
        "description": "列举常见的慢查询优化手段并解释执行计划关键指标",
        "md": "# 慢查询优化\n\n## 优化步骤\n1. 开启慢查询日志\n   ```sql\n   SET GLOBAL slow_query_log = ON;\n   SET GLOBAL long_query_time = 2; -- 单位秒\n   ```\n2. 使用EXPLAIN分析\n   ```sql\n   EXPLAIN SELECT * FROM orders WHERE amount > 1000;\n   ```\n3. 关键指标解读\n   | 字段    | 优化关注点                  |\n   |---------|----------------------------|\n   | type    | ALL需优化为range/const     |\n   | key     | 是否使用正确索引           |\n   | rows    | 扫描行数越少越好           |\n   | Extra   | Using filesort需优化       |\n\n## 常见优化手段\n- 为WHERE条件字段添加索引\n- 避免在索引列上使用函数\n- 使用覆盖索引减少回表\n- 拆分大查询为多个小查询\n[4](@ref)[9](@ref)[1](@ref)",
        "tags": ["慢查询", "执行计划", "索引优化"]
    },
    {
        "id": 13,
        "categoryId": "mysql",
        "title": "数据库备份策略",
        "difficulty": "中等",
        "viewCount": 2150,
        "description": "对比物理备份与逻辑备份的差异，并说明常用备份工具的使用方法",
        "md": "# 数据库备份策略\n\n## 备份类型对比\n| 类型     | 工具       | 优点                  | 缺点                  |\n|----------|------------|-----------------------|-----------------------|\n| 逻辑备份 | mysqldump  | 兼容性好，可读性强    | 恢复慢，大库耗时      |\n| 物理备份 | xtrabackup | 备份/恢复快           | 存储空间占用大        |\n\n## 备份示例\n```bash\n# 逻辑备份\nmysqldump -uroot -p --single-transaction dbname > backup.sql\n\n# 物理备份\nxtrabackup --backup --user=root --password=123456 --target-dir=/backup/\n\n# 定时任务配置\n0 2 * * * /usr/bin/mysqldump -uroot -p123456 dbname | gzip > /backup/db_$(date +%F).sql.gz\n```\n[2](@ref)[5](@ref)[8](@ref)",
        "tags": ["备份恢复", "mysqldump", "xtrabackup"]
    },
    {
        "id": 14,
        "categoryId": "mysql",
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
        categoryId: "java",
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
        categoryId: "java",
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
        "categoryId": "java",
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
        id: 1,
        categoryId: "ds",
        title: "常见排序算法比较",
        difficulty: "中等",
        viewCount: 1234,
        description: "请比较常见排序算法的时间复杂度、空间复杂度和稳定性，并说明它们的适用场景。",
        code: "",
        md: "# 常见排序算法比较\n\n## 排序算法复杂度与特性\n\n| 算法 | 平均时间复杂度 | 最坏时间复杂度 | 空间复杂度 | 稳定性 |\n|------|--------------|--------------|-----------|-------|\n| 冒泡排序 | O(n²) | O(n²) | O(1) | 稳定 |\n| 选择排序 | O(n²) | O(n²) | O(1) | 不稳定 |\n| 插入排序 | O(n²) | O(n²) | O(1) | 稳定 |\n| 希尔排序 | O(nlogn) | O(n²) | O(1) | 不稳定 |\n| 归并排序 | O(nlogn) | O(nlogn) | O(n) | 稳定 |\n| 快速排序 | O(nlogn) | O(n²) | O(logn) | 不稳定 |\n| 堆排序 | O(nlogn) | O(nlogn) | O(1) | 不稳定 |\n| 计数排序 | O(n+k) | O(n+k) | O(k) | 稳定 |\n| 桶排序 | O(n+k) | O(n²) | O(n+k) | 稳定 |\n| 基数排序 | O(nk) | O(nk) | O(n+k) | 稳定 |\n\n## 适用场景\n\n1. **插入排序**：小规模数据或基本有序的数据\n2. **快速排序**：大规模数据，平均性能最优\n3. **归并排序**：稳定性要求高，且有额外空间\n4. **堆排序**：大规模数据，且空间有限\n5. **计数/桶/基数排序**：特定数据分布，如整数、范围有限\n\n## 代码示例（快速排序）\n\n```java\npublic void quickSort(int[] arr, int left, int right) {\n    if (left < right) {\n        int pivot = partition(arr, left, right);\n        quickSort(arr, left, pivot - 1);\n        quickSort(arr, pivot + 1, right);\n    }\n}\n\nprivate int partition(int[] arr, int left, int right) {\n    int pivot = arr[right];\n    int i = left - 1;\n    for (int j = left; j < right; j++) {\n        if (arr[j] <= pivot) {\n            i++;\n            swap(arr, i, j);\n        }\n    }\n    swap(arr, i + 1, right);\n    return i + 1;\n}\n```",
        tags: ["排序算法", "时间复杂度", "空间复杂度"]
      }
    ],
    redis: [
      {
        id: 1,
        categoryId: "redis",
        title: "Redis数据类型及应用场景",
        difficulty: "中等",
        viewCount: 1876,
        description: "请详细介绍Redis的五种基本数据类型及其应用场景，并说明如何选择合适的数据类型。",
        code: "",
        md: "# Redis数据类型及应用场景\n\n## 五种基本数据类型\n\n### 1. String（字符串）\n- **结构**：二进制安全的字符串，最大512MB\n- **命令**：SET, GET, INCR, DECR, MSET, MGET\n- **应用场景**：\n  - 缓存对象（JSON序列化）\n  - 计数器（如访问次数、点赞数）\n  - 分布式锁\n  - 会话缓存\n\n### 2. Hash（哈希）\n- **结构**：键值对集合，适合存储对象\n- **命令**：HSET, HGET, HMSET, HMGET, HGETALL\n- **应用场景**：\n  - 用户信息、商品信息等对象存储\n  - 购物车\n\n### 3. List（列表）\n- **结构**：双向链表，按插入顺序排序\n- **命令**：LPUSH, RPUSH, LPOP, RPOP, LRANGE\n- **应用场景**：\n  - 消息队列（有限）\n  - 最新动态、评论列表\n  - 关注列表\n\n### 4. Set（集合）\n- **结构**：无序不重复集合\n- **命令**：SADD, SMEMBERS, SINTER, SUNION, SREM\n- **应用场景**：\n  - 标签系统\n  - 用户关注、粉丝集合\n  - 去重（如IP统计）\n\n### 5. Sorted Set（有序集合）\n- **结构**：有序不重复集合，每个元素关联一个分数\n- **命令**：ZADD, ZRANGE, ZREVRANGE, ZRANK\n- **应用场景**：\n  - 排行榜\n  - 优先级队列\n  - 范围查询（如按时间范围）\n\n## 选择合适的数据类型\n\n1. **需要自动过期**：所有类型都可设置过期时间\n2. **存储对象**：\n   - 简单对象且不需要部分更新：String + 序列化\n   - 需要部分更新：Hash\n3. **计数场景**：String + INCR/DECR\n4. **有序数据**：Sorted Set\n5. **集合操作**：Set（交集、并集等）\n6. **队列**：List\n\n## 扩展数据类型\n\n- **Bitmap**：节省空间的位操作\n- **HyperLogLog**：估算基数\n- **Geo**：地理位置\n- **Stream**：更强大的消息队列",
        tags: ["数据类型", "应用场景", "缓存设计"]
      },
      {
        id: 2,
        categoryId: "redis",
        title: "Redis持久化机制",
        difficulty: "中等",
        viewCount: 1543,
        description: "请详细介绍Redis的持久化机制（RDB和AOF），并比较它们的优缺点和适用场景。",
        code: "",
        md: "# Redis持久化机制\n\n## RDB（Redis Database）\n\n### 工作原理\nRDB持久化通过创建数据库快照（snapshot）来保存数据。Redis会在指定的时间间隔内将内存中的数据集写入磁盘。\n\n### 触发方式\n1. **自动触发**：根据配置文件中的save参数\n   ```\n   save 900 1    # 900秒内至少1个key变化\n   save 300 10   # 300秒内至少10个key变化\n   save 60 10000 # 60秒内至少10000个key变化\n   ```\n\n2. **手动触发**：\n   - `SAVE`命令：阻塞Redis服务器进程\n   - `BGSAVE`命令：创建子进程，不阻塞服务器\n\n### 优点\n- 文件紧凑，适合备份\n- 恢复速度快\n- 性能影响小（fork子进程）\n- 适合大规模数据恢复\n\n### 缺点\n- 可能丢失最后一次快照后的数据\n- fork过程可能导致服务短暂暂停\n- 数据量大时fork耗时增加\n\n## AOF（Append Only File）\n\n### 工作原理\nAOF持久化记录服务器执行的所有写操作命令，并在服务器启动时重新执行这些命令来恢复数据。\n\n### 配置选项\n```\nappendonly yes                 # 启用AOF\nappendfsync always             # 每次写入都同步\nappendfsync everysec           # 每秒同步一次（默认）\nappendfsync no                 # 由操作系统决定同步时机\n```\n\n### 重写机制\nAOF文件会随时间增长，Redis提供了`BGREWRITEAOF`命令来重写AOF文件，减小文件体积。\n\n### 优点\n- 数据安全性高，支持不同级别的同步\n- 文件易于理解和分析\n- 可在后台重写压缩\n\n### 缺点\n- 文件体积通常大于RDB\n- 恢复速度慢于RDB\n- 对性能影响较大（尤其是fsync策略为always时）\n\n## 持久化策略选择\n\n### 仅使用RDB\n- 适合：对数据丢失不敏感，注重性能，数据量大\n- 配置：关闭AOF，配置合适的RDB保存策略\n\n### 仅使用AOF\n- 适合：对数据安全性要求高，能接受较低性能\n- 配置：开启AOF，选择合适的fsync策略\n\n### 同时使用RDB和AOF（推荐）\n- 优势：兼顾数据安全和恢复速度\n- 配置：开启AOF，设置适当的RDB策略作为备份\n- 恢复时优先使用AOF\n\n### 无持久化\n- 适合：纯缓存场景，数据丢失可接受\n- 配置：关闭RDB和AOF",
        tags: ["持久化", "RDB", "AOF", "数据恢复"]
      }
    ]
  }
}
