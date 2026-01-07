module.exports = {
  categories: [
    {
      id: 1,
      name: "MySQL",
      key: "mysql",
      description: "MySQL是一款开源关系型数据库，基于C/S架构，支持ACID事务（通过InnoDB引擎实现），采用MVCC机制与行级锁提升并发性能。数据以B+树索引组织，支持聚簇/非聚簇索引优化查询。存储引擎层可插拔（如InnoDB、MyISAM），事务日志（redo/undo）与binlog保障崩溃恢复及主从复制（异步/半同步）。提供SQL优化器、执行计划解析及慢查询分析，支持分区表、窗口函数。高可用方案涵盖主从集群、组复制（MGR）及InnoDB Cluster，通过XA协议实现分布式事务。工具链包含Performance Schema监控、EXPLAIN性能调优及在线DDL操作，适应高并发OLTP场景与云原生架构。",
      questionCount: 52,
      icon: "https://img2024.cnblogs.com/blog/1326459/202503/1326459-20250318155403105-1265083507.png",
      order: 1
    },
    {
      id: 2,
      name: "Java基础",
      key: "javabasics",
      description: "Java是一种静态类型、面向对象的跨平台语言，基于JVM实现\"Write Once, Run Anywhere\"。其核心技术包括：类加载机制、字节码执行、自动内存管理（分代GC算法）；JVM内存模型（堆/栈/Metaspace）；强类型系统与多态继承机制。支持并发编程（java.util.concurrent包）及NIO非阻塞IO。通过JIT编译器优化运行时性能。企业级开发常用Spring Boot微服务架构，配合Maven/Gradle构建工具。JDK 17+引入Records、Sealed Classes等特性，增强模式匹配和异步编程能力。长期支持版本（LTS）确保稳定性，适用于高并发分布式系统，结合JMX监控和Arthurs诊断工具实现深度调优。",
      questionCount: 40,
      icon: "https://img2024.cnblogs.com/blog/1326459/202503/1326459-20250320193014199-199767568.png",
      order: 2
    },
    {
      id: 3,
      name: "数据结构",
      key: "ds",
      description: "数据结构是计算机存储、组织数据的逻辑结构，用于实现高效数据访问与操作。核心类型包括线性结构（数组、链表、栈/队列）、树形结构（二叉树、B/B+树）、图结构（邻接表/矩阵）和哈希表（开放寻址/链地址法）。高级结构如堆（优先级队列）、Trie（前缀检索）、并查集（连通性检测）针对特定场景优化。设计时需权衡时间/空间复杂度，结合数据规模与操作频次（查询/插入/删除），如红黑树保障O(logn)操作，布隆过滤器以可控误判率换取空间压缩。合理选择数据结构能优化算法效率，如Dijkstra算法采用优先队列可将时间复杂度从O(V²)降至O(E+VlogV)。",
      questionCount: 1,
      icon: "/images/list/data-structure.png",
      order: 3
    },
    {
      id: 4,
      name: "Redis",
      key: "redis",
      description: "Redis是一款高性能内存数据库，支持持久化（RDB快照/AOF日志），以单线程事件驱动模型实现高吞吐（10万+ QPS）。核心提供String、Hash、List、Set、SortedSet等数据结构，支持原子操作、Lua脚本及弱事务（非ACID）。采用多路复用I/O降低延迟，通过主从复制、哨兵（Sentinel）及Cluster分片（16384槽）实现高可用与水平扩展。支持过期策略（惰性/定期删除）、内存淘汰机制（LRU等）及管道批处理。常用于缓存、会话存储、实时排行榜及分布式锁（SET NX），同时支持Stream实现消息队列。通过RDB与AOF混合模式平衡数据安全与性能，适应高并发低延迟场景。",
      questionCount: 30,
      icon: "https://img2024.cnblogs.com/blog/1326459/202503/1326459-20250318155413811-533727752.png",
      order: 4
    },
    {
      id: 5,
      name: "Python",
      key: "python",
      description: "Python是一种动态类型、解释型的高级编程语言，以简洁语法和丰富生态著称。其核心采用引用计数与分代垃圾回收机制管理内存，支持多范式编程（面向对象/函数式/过程式）。通过CPython解释器执行字节码，GIL（全局解释器锁）限制多线程并发效率，但可通过multiprocessing或asyncio协程实现并行。内置装饰器、生成器、上下文管理器等高级特性，标准库涵盖网络通信(asyncio)、数据结构(collections)等模块。广泛应用于数据分析（Pandas/NumPy）、机器学习（PyTorch/TensorFlow）、Web开发（Django/Flask）及自动化运维。动态类型系统支持鸭子类型，配合mypy实现渐进式类型检查。通过C扩展(Cython)或JIT编译器(PyPy)提升性能，兼容性强的.pyc字节码便于部署。持续迭代的类型提示（Type Hints）和模式匹配（Python 3.10+）增强工程化能力，结合PyPI生态快速构建复杂系统。",
      questionCount: 21,
      icon: "https://img2024.cnblogs.com/blog/1326459/202503/1326459-20250318155411219-364423108.png",
      order: 5
    },
    {
      id: 6,
      name: "GoLang",
      key: "golang",
      description: "Golang是由Google开发的开源静态类型、编译型语言，语法简洁高效，支持垃圾回收（GC）与内存安全。核心特性包括轻量级协程（goroutine）与CSP并发模型（基于channel通信），通过GMP调度器实现高并发（百万级协程）。编译为静态二进制文件，依赖少，跨平台支持良好。内置接口（隐式实现）、结构体组合及defer机制，支持反射与交叉编译。GC采用并发标记-清除算法（三色标记法），优化低延迟。标准库覆盖网络、加密、并发等场景，工具链强大（go fmt/test/mod）。高性能接近C，适用于微服务（Gin/Echo）、云原生（Docker/Kubernetes）及分布式系统，凭借高效编译、协程调度与原生并发优势成为后端开发主流选择。",
      questionCount: 45,
      icon: "/images/list/golang.png",
      order: 6
    },
    {
      id: 7,
      name: "Java集合",
      key: "javacollections",
      description: "Java集合是Java中用于存储和操作一组对象的类和接口的集合。它提供了多种数据结构，如List、Set、Map等，每种结构都有不同的实现类，如ArrayList、LinkedList、HashSet、HashMap等。这些集合类具有不同的特性和性能，适用于不同的场景。Java集合框架提供了统一的体系结构，使得开发人员可以方便地使用和操作集合数据。",
      questionCount: 20,
      icon: "/images/list/java5.png",
      order: 2
    },
    {
      id: 8,
      name: "Java并发",
      key: "javaconcurrent",
      description: "Java并发是多线程程序设计，线程是执行单位，通过实现Runnable或继承Thread创建。共享数据需用锁（如synchronized）保证线程安全，避免竞态条件。Java并发包（java.util.concurrent）提供Executor线程池、Future结果获取、阻塞队列等工具，提升开发效率。",
      questionCount: 20,
      icon: "https://img2024.cnblogs.com/blog/1326459/202503/1326459-20250320193157431-1325167186.png",
      order: 2
    },
    {
      id: 9,
      name: "Java虚拟机",
      key: "javajvm",
      description: "Java虚拟机（JVM）是Java运行时环境的核心，负责执行Java字节码。它通过类加载器加载.class文件，使用执行引擎解释执行字节码指令。JVM具备自动内存管理功能，通过垃圾回收机制有效管理对象内存。其跨平台特性使Java程序能在不同操作系统上运行，底层由JVM实现。JVM的架构包括程序计数器、Java栈、本地方法栈、Java堆、方法区等，各部分协同工作，保障Java程序稳定运行。",
      questionCount: 20,
      icon: "https://img2024.cnblogs.com/blog/1326459/202503/1326459-20250320193241262-1516538082.png",
      order: 2
    },
    {
      id: 10,
      name: "Hadoop",
      key: "hadoop",
      description: "Hadoop是一个开源的分布式计算平台，基于Java开发，核心是HDFS和MapReduce。HDFS负责分布式存储，将数据分割成多个块存储在不同节点，提供高容错性和高扩展性；MapReduce则用于大规模数据的并行计算，简化编程模型，支持复杂统计和数据分析任务。",
      questionCount: 30,
      icon: "/images/list/hadoop.png",
      order: 10
    },
    {
      id: 11,
      name: "Linux",
      key: "linux",
      description: "Linux是一款免费开源的类Unix操作系统，基于GNU通用公共许可证（GPL）发布，内核由林纳斯·托瓦兹于1991年创建。从技术层面看，Linux具有诸多优势。其采用多用户多任务的32/64位操作系统，内核空间与用户空间隔离，有效提升系统稳定性与安全性。同时，Linux支持多种文件系统，如ext2、ext3、ext4、xfs等，可按需选择与配置。此外，其拥有强大的网络功能，内置TCP/IP协议，能轻松设置代理服务器及防火墙，是互联网服务器的主流选择。Linux系统还提供丰富的开发工具，如gcc、g++、make等，为软件开发与编译提供便利。",
      questionCount: 30,
      icon: "https://img2024.cnblogs.com/blog/1326459/202503/1326459-20250318154728868-948895600.png",
      order: 10
    },
    {
      id: 12,
      name: "Spring",
      key: "spring",
      description: "Spring是一个开源的Java企业级应用开发框架，由Rod Johnson创建。从技术角度看，Spring框架的核心是控制反转（IoC）和面向切面（AOP）。IoC容器负责创建对象，管理对象间的依赖关系，实现了松耦合。AOP用于将横切关注点（如日志、事务）模块化，增强代码复用性和可维护性。Spring还提供了数据访问层的抽象，简化了JDBC、Hibernate等的使用。此外，Spring MVC是功能强大的Web框架，支持灵活的配置和多种视图技术。Spring Boot简化了Spring应用的初始搭建和开发过程，Spring Cloud则为微服务架构提供了工具集，方便构建分布式系统。",
      questionCount: 0,
      icon: "https://img2024.cnblogs.com/blog/1326459/202503/1326459-20250318154738271-1587542254.png",
      order: 3
    },
    {
      id: 13,
      name: "Kafka",
      key: "kafka",
      description: "Kafka是一种分布式流处理平台，由LinkedIn开发并开源。它具有高吞吐量、低延迟、可扩展性强等特点。主要用于处理大量实时数据，支持消息队列和流式数据处理。常用于日志收集、事件驱动架构、实时数据分析等场景，可帮助系统高效地传输和处理数据，广泛应用于互联网、金融、物联网等领域。",
      questionCount: 20,
      icon: "https://img2024.cnblogs.com/blog/1326459/202503/1326459-20250330120223028-80287795.png",
      order: 3
    },
    
  ]
}
