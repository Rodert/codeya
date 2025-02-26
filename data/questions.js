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
        solution: [
          {
            type: "text",
            content: "MySQL索引原理主要包括以下几点："
          },
          {
            type: "text",
            content: "1. B+树结构"
          },
          {
            type: "image",
            url: "https://i-blog.csdnimg.cn/blog_migrate/dadbf353e9c2191ab007f9e0e1924470.png",
            description: "B+树结构示意图"
          },
          {
            type: "text",
            content: "• 所有数据都存储在叶子节点\n• 非叶子节点只存储索引键值\n• 叶子节点间通过链表连接"
          },
          {
            type: "text",
            content: "2. 索引失效的常见情况："
          },
          {
            type: "text",
            content: "• 使用!=或<>操作符\n• 使用函数操作索引列\n• 类型隐式转换\n• 使用OR连接条件\n• Like以通配符开头"
          }
        ],
        code: "-- 创建索引示例\nCREATE INDEX idx_name ON table_name(column_name);\n\n-- 复合索引示例\nCREATE INDEX idx_name_age ON table_name(name, age);",
        tags: ["索引", "优化", "B+树"]
      },
      {
        id: 2,
        categoryId: 1,
        title: "事务的ACID特性",
        difficulty: "简单",
        viewCount: 980,
        description: "请解释MySQL事务的四个特性（ACID），并说明MySQL是如何保证这些特性的？",
        solution: [
          {
            type: "text",
            content: "事务的ACID特性："
          },
          {
            type: "image",
            url: "https://img-blog.csdnimg.cn/direct/d7334c67c9da48c0a23245fd004ff4bb.png",
            description: "ACID特性示意图"
          },
          {
            type: "text",
            content: "1. 原子性（Atomicity）"
          },
          {
            type: "text",
            content: "2. 一致性（Consistency）"
          },
          {
            type: "text",
            content: "3. 隔离性（Isolation）"
          },
          {
            type: "text",
            content: "4. 持久性（Durability）"
          }
        ],
        code: "-- 事务示例\nBEGIN;\nUPDATE account SET balance = balance - 100 WHERE id = 1;\nUPDATE account SET balance = balance + 100 WHERE id = 2;\nCOMMIT;",
        tags: ["事务", "ACID", "隔离级别"]
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
        solution: [
          {
            type: "text",
            content: "线程池原理："
          },
          {
            type: "text",
            content: "1. 核心线程数和最大线程数"
          },
          {
            type: "image",
            url: "https://javapub-common-oss.oss-cn-beijing.aliyuncs.com/javapub/202502261113845.jpeg",
            description: "线程池示意图"
          },
          {
            type: "text",
            content: "2. 工作队列"
          },
          {
            type: "text",
            content: "3. 拒绝策略"
          },
          {
            type: "text",
            content: "4. 线程回收机制"
          }
        ],
        code: "ExecutorService executor = new ThreadPoolExecutor(\n    corePoolSize,\n    maximumPoolSize,\n    keepAliveTime,\n    TimeUnit.SECONDS,\n    new LinkedBlockingQueue<>());",
        tags: ["线程池", "并发", "线程安全"]
      },
      {
        id: 4,
        categoryId: 2,
        title: "Java集合框架",
        difficulty: "中等",
        viewCount: 1800,
        description: "请详细介绍Java集合框架的主要类型和使用场景。",
        solution: [
          {
            type: "text",
            content: "Java集合框架主要包括："
          },
          {
            type: "text",
            content: "1. List：有序集合"
          },
          {
            type: "image",
            url: "/images/java-list.png",
            description: "List示意图"
          },
          {
            type: "text",
            content: "2. Set：不重复元素集合"
          },
          {
            type: "text",
            content: "3. Map：键值对映射"
          },
          {
            type: "text",
            content: "4. Queue：队列"
          }
        ],
        code: "// List示例\nList<String> list = new ArrayList<>();\nlist.add(\"Hello\");\n\n// Set示例\nSet<Integer> set = new HashSet<>();\nset.add(1);\n\n// Map示例\nMap<String, Integer> map = new HashMap<>();\nmap.put(\"key\", 1);",
        tags: ["集合", "List", "Set", "Map"]
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
        solution: [
          {
            type: "text",
            content: "红黑树特性："
          },
          {
            type: "text",
            content: "1. 节点是红色或黑色"
          },
          {
            type: "image",
            url: "/images/redblacktree.jpg",
            description: "红黑树示意图"
          },
          {
            type: "text",
            content: "2. 根节点是黑色"
          },
          {
            type: "text",
            content: "3. 叶子节点（NIL）是黑色"
          },
          {
            type: "text",
            content: "4. 红色节点的子节点必须是黑色"
          },
          {
            type: "text",
            content: "5. 从根到叶子的所有路径包含相同数量的黑色节点"
          }
        ],
        code: "public class RedBlackTree<T extends Comparable<T>> {\n    private Node root;\n    private static final boolean RED = true;\n    private static final boolean BLACK = false;\n    \n    private class Node {\n        T key;\n        Node left, right;\n        boolean color;\n    }\n}",
        tags: ["红黑树", "平衡树", "数据结构"]
      }
    ],
    redis: [
      {
        id: 6,
        categoryId: 4,
        title: "Redis持久化机制",
        difficulty: "中等",
        viewCount: 1890,
        description: "请详细说明Redis的RDB和AOF两种持久化机制的原理、优缺点及使用场景。",
        solution: [
          {
            type: "text",
            content: "Redis持久化机制："
          },
          {
            type: "text",
            content: "1. RDB（快照）持久化："
          },
          {
            type: "image",
            url: "/images/redis-rdb.jpeg",
            description: "RDB示意图"
          },
          {
            type: "text",
            content: "• 原理：将某一时刻的所有数据生成快照写入硬盘"
          },
          {
            type: "text",
            content: "• 优点：文件紧凑，恢复快速"
          },
          {
            type: "text",
            content: "• 缺点：可能丢失最后一次快照后的数据"
          }
        ],
        code: "# redis.conf配置示例\n\n# RDB配置\nsave 900 1      # 900秒内至少1个key被修改\nsave 300 10     # 300秒内至少10个key被修改\nsave 60 10000   # 60秒内至少10000个key被修改\n\n# AOF配置\nappendonly yes\nappendfsync everysec",
        tags: ["持久化", "RDB", "AOF"]
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
        solution: [
          {
            type: "text",
            content: "Python装饰器是一种函数包装器，它可以在不修改原函数代码的情况下增加新的功能。主要用途："
          },
          {
            type: "text",
            content: "1. 函数执行时间统计"
          },
          {
            type: "image",
            url: "/images/python-decorator1.png",
            description: "装饰器示意图1"
          },
          {
            type: "image",
            url: "/images/python-decorator2.png",
            description: "装饰器示意图2"
          },
          {
            type: "text",
            content: "2. 访问控制和权限校验"
          },
          {
            type: "text",
            content: "3. 缓存"
          },
          {
            type: "text",
            content: "4. 日志记录"
          }
        ],
        code: `# 装饰器定义\ndef log_execution_time(func):\n    def wrapper(*args, **kwargs):\n        import time\n        start = time.time()\n        result = func(*args, **kwargs)\n        end = time.time()\n        print(f\"{func.__name__} 执行时间: {end - start}秒\")\n        return result\n    return wrapper\n\n# 使用装饰器\n@log_execution_time\ndef calculate_sum(n):\n    return sum(range(n))\n\n# 调用函数\nresult = calculate_sum(1000000)\n# 输出：calculate_sum 执行时间: 0.1234秒`,
        tags: ["装饰器", "函数式编程", "性能统计"]
      }
    ]
  }
}
