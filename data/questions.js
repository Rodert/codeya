module.exports = {
  questions: {
    mysql: [
      {
        "id": 1,
        "categoryId": "mysql",
        "title": "写出一条SQL语句，查询出某张表中重复的记录？",
        "difficulty": "简单",
        "viewCount": 1234,
        "code": "SELECT id, name, COUNT(*) AS count FROM table GROUP BY id, name HAVING count > 1;",
        "md": "# 查询重复记录\n\n使用`GROUP BY`对可能重复的字段进行分组，然后通过`HAVING`子句筛选出出现次数大于1的组。",
        "tags": ["SQL查询", "重复记录", "GROUP BY"]
      },
      {
        "id": 2,
        "categoryId": "mysql",
        "title": "说明MySQL中InnoDB和MyISAM存储引擎的区别？",
        "difficulty": "中等",
        "viewCount": 2345,
        "code": "",
        "md": "# InnoDB与MyISAM区别\n\n## 事务支持\n- **InnoDB**：支持事务处理，具有ACID特性。\n- **MyISAM**：不支持事务处理。\n\n## 锁机制\n- **InnoDB**：行级锁，适合高并发场景。\n- **MyISAM**：表级锁，写操作会锁定整张表。\n\n## 性能\n- **InnoDB**：读写操作性能均衡，适合事务性应用。\n- **MyISAM**：读操作性能较高，适合读多写少的场景。",
        "tags": ["存储引擎", "InnoDB", "MyISAM"]
      },
      {
        "id": 3,
        "categoryId": "mysql",
        "title": "写出一条SQL语句，将两个表按照某个字段进行左连接查询？",
        "difficulty": "简单",
        "viewCount": 1567,
        "code": "SELECT * FROM table1 LEFT JOIN table2 ON table1.common_field = table2.common_field;",
        "md": "# 左连接查询\n\n使用`LEFT JOIN`将两个表按照指定字段进行连接，左表所有记录都会被保留，右表中没有匹配的字段会以NULL填充。",
        "tags": ["SQL查询", "连接查询", "LEFT JOIN"]
      },
      {
        "id": 4,
        "categoryId": "mysql",
        "title": "说明什么是MySQL索引，以及如何创建、删除索引？",
        "difficulty": "中等",
        "viewCount": 1890,
        "code": "CREATE INDEX index_name ON table (column); DROP INDEX index_name ON table;",
        "md": "# 索引的创建与删除\n\n## 什么是索引\n索引是数据库中用于提高查询速度的数据结构，通过在表的列上创建索引，可以加快查询操作的执行速度。\n\n## 创建索引\n```sql\nCREATE INDEX index_name ON table (column);\n```\n\n## 删除索引\n```sql\nDROP INDEX index_name ON table;\n```\n\n## 索引对性能的影响\n- **优点**：提高查询速度，特别是在大数据量的情况下。\n- **缺点**：增加存储空间，影响插入、更新和删除操作的性能。",
        "tags": ["索引", "性能优化", "创建", "删除"]
      },
      {
        "id": 5,
        "categoryId": "mysql",
        "title": "说明如何对MySQL数据库进行备份和恢复？",
        "difficulty": "中等",
        "viewCount": 2012,
        "code": "mysqldump -u username -p dbname > backup.sql; mysql -u username -p dbname < backup.sql;",
        "md": "# 数据库备份与恢复\n\n## 备份\n使用`mysqldump`工具进行数据库备份：\n```bash\nmysqldump -u username -p dbname > backup.sql\n```\n\n## 恢复\n将备份文件导入到数据库中：\n```bash\nmysql -u username -p dbname < backup.sql\n```\n\n## 场景应用\n- **定期备份**：用于数据安全和灾难恢复。\n- **迁移**：在不同服务器之间迁移数据库。\n- **测试环境**：从生产环境复制数据到测试环境。",
        "tags": ["数据库管理", "备份", "恢复", "mysqldump"]
      },
      {
        "id": 6,
        "categoryId": "mysql",
        "title": "如何优化MySQL查询性能？",
        "difficulty": "中等",
        "viewCount": 3456,
        "code": "EXPLAIN SELECT * FROM table WHERE column = 'value';",
        "md": "# 查询性能优化\n\n## 分析查询性能\n使用`EXPLAIN`关键字可以查看查询的执行计划，分析查询性能：\n```sql\nEXPLAIN SELECT * FROM table WHERE column = 'value';\n```\n\n## 优化技巧\n- **添加索引**：在查询条件中使用的列上添加索引，可以大大加快查询速度。\n- **避免使用`SELECT *`**：只查询需要的列，减少数据传输量，提高查询效率。\n- **减少子查询**：子查询可能导致性能下降，尽量用连接查询替代，因为连接查询通常更高效。\n- **分页优化**：合理设置分页参数，避免查询过大范围的数据，减少服务器负担。\n- **避免在WHERE子句中使用函数**：这会导致无法使用索引，从而降低查询性能。\n- **使用缓存机制**：对于频繁查询且数据变化不频繁的数据，可以使用缓存来减少数据库的访问次数。",
        "tags": ["性能优化", "查询优化", "EXPLAIN"]
      },
      {
        "id": 7,
        "categoryId": "mysql",
        "title": "如何创建存储过程？",
        "difficulty": "中等",
        "viewCount": 2567,
        "code": "CREATE PROCEDURE procedure_name() BEGIN ... END;",
        "md": "# 创建存储过程\n\n存储过程是一组SQL语句的集合，可以预先编译并保存在数据库中，便于重复调用。\n\n## 基本语法\n```sql\nCREATE PROCEDURE procedure_name()\nBEGIN\n  -- SQL语句\nEND;\n```\n\n## 示例\n创建一个简单的存储过程来查询用户信息：\n```sql\nCREATE PROCEDURE get_user_info()\nBEGIN\n  SELECT * FROM users;\nEND;\n```\n\n## 调用存储过程\n使用`CALL`语句来调用存储过程：\n```sql\nCALL get_user_info();\n```\n\n## 优点\n- **代码复用**：存储过程可以被多个应用程序调用，避免重复编写相同的SQL代码。\n- **性能提升**：存储过程在创建时会被编译，执行速度比单条SQL语句更快。\n- **安全性**：可以通过权限控制谁可以调用存储过程，提高数据库的安全性。",
        "tags": ["存储过程", "SQL", "编程"]
      },
      {
        "id": 8,
        "categoryId": "mysql",
        "title": "如何创建视图？",
        "difficulty": "简单",
        "viewCount": 1987,
        "code": "CREATE VIEW view_name AS SELECT ...;",
        "md": "# 创建视图\n\n视图是基于SQL语句的结果集的虚拟表，不存储实际的数据，而是存储查询的定义。\n\n## 基本语法\n```sql\nCREATE VIEW view_name AS\nSELECT column1, column2, ...\nFROM table_name\nWHERE condition;\n```\n\n## 示例\n创建一个视图来显示活跃用户：\n```sql\nCREATE VIEW active_users AS\nSELECT user_id, username\nFROM users\nWHERE status = 'active';\n```\n\n## 使用视图\n可以通过视图来查询数据，就像查询普通表一样：\n```sql\nSELECT * FROM active_users;\n```\n\n## 优点\n- **简化查询**：视图可以简化复杂的查询，特别是当查询涉及多个表的连接时。\n- **安全性**：可以通过视图只暴露部分数据给用户，而不暴露底层的表结构和数据。\n- **数据独立性**：视图的定义与底层表的结构分离，当表结构发生变化时，视图可以保持不变。",
        "tags": ["视图", "SQL", "虚拟表"]
      },
      {
        "id": 9,
        "categoryId": "mysql",
        "title": "如何创建触发器？",
        "difficulty": "中等",
        "viewCount": 2123,
        "code": "CREATE TRIGGER trigger_name BEFORE INSERT ON table FOR EACH ROW ...;",
        "md": "# 创建触发器\n\n触发器是在特定的数据库操作（如INSERT、UPDATE、DELETE）发生时自动执行的SQL代码。\n\n## 基本语法\n```sql\nCREATE TRIGGER trigger_name\nBEFORE INSERT\nON table_name\nFOR EACH ROW\nBEGIN\n  -- SQL语句\nEND;\n```\n\n## 示例\n创建一个触发器，在插入新用户时记录日志：\n```sql\nCREATE TRIGGER log_user_insert\nAFTER INSERT\nON users\nFOR EACH ROW\nBEGIN\n  INSERT INTO logs (log_time, user_id, action)\n  VALUES (NOW(), NEW.user_id, 'User inserted');\nEND;\n```\n\n## 触发时机\n- **BEFORE**：在执行INSERT、UPDATE或DELETE操作之前触发。\n- **AFTER**：在执行INSERT、UPDATE或DELETE操作之后触发。\n\n## 优点\n- **自动执行**：触发器可以自动执行，无需手动调用。\n- **数据完整性**：可以用于维护数据的完整性，例如在更新数据时自动检查某些条件。\n- **审计日志**：可以用于记录操作日志，方便后续的审计和分析。",
        "tags": ["触发器", "SQL", "自动化"]
      },
      {
        "id": 10,
        "categoryId": "mysql",
        "title": "如何使用MySQL的函数进行字符串处理？",
        "difficulty": "简单",
        "viewCount": 1789,
        "code": "SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM users;",
        "md": "# 字符串处理函数\n\nMySQL提供了丰富的字符串处理函数，可以方便地对字符串进行操作。\n\n## 常用函数\n- **CONCAT(str1, str2, ...)**：将多个字符串连接成一个字符串。\n- **LENGTH(str)**：返回字符串的长度。\n- **UPPER(str)**：将字符串转换为大写。\n- **LOWER(str)**：将字符串转换为小写。\n- **SUBSTRING(str, pos, len)**：从字符串中提取子字符串。\n- **REPLACE(str, search_str, replace_str)**：将字符串中的某个子字符串替换为另一个字符串。\n\n## 示例\n将用户表中的名字和姓氏连接成全名：\n```sql\nSELECT CONCAT(first_name, ' ', last_name) AS full_name FROM users;\n```\n\n## 应用场景\n- **数据清洗**：在数据导入或处理过程中，对字符串进行清洗和格式化。\n- **报表生成**：在生成报表时，对字符串进行格式化，使其更易于阅读。\n- **搜索功能**：在搜索功能中，对用户输入的关键词进行处理，提高搜索的准确性。",
        "tags": ["字符串处理", "函数", "SQL"]
      },
      {
        "id": 11,
        "categoryId": "mysql",
        "title": "如何管理MySQL用户权限？",
        "difficulty": "中等",
        "viewCount": 2456,
        "code": "GRANT SELECT, INSERT ON database.table TO 'user'@'host' IDENTIFIED BY 'password';",
        "md": "# 用户权限管理\n\nMySQL通过权限系统来控制用户对数据库的访问，确保数据的安全性。\n\n## 授予权限\n使用`GRANT`语句可以授予权限给用户：\n```sql\nGRANT SELECT, INSERT ON database.table TO 'user'@'host' IDENTIFIED BY 'password';\n```\n\n## 撤销权限\n使用`REVOKE`语句可以撤销用户的权限：\n```sql\nREVOKE SELECT, INSERT ON database.table FROM 'user'@'host';\n```\n\n## 查看用户权限\n可以查询`mysql.user`表或使用`SHOW GRANTS`语句来查看用户的权限：\n```sql\nSHOW GRANTS FOR 'user'@'host';\n```\n\n## 权限类型\n- **全局权限**：对所有数据库和表生效。\n- **数据库权限**：对特定数据库中的所有表生效。\n- **表权限**：对特定表生效。\n- **列权限**：对表中的特定列生效。\n\n## 优点\n- **细粒度控制**：可以精确控制用户对不同数据库、表、列的访问权限。\n- **安全性**：通过合理的权限分配，可以防止未授权的访问和数据泄露。\n- **灵活性**：可以根据用户的角色和需求灵活地授予权限。",
        "tags": ["权限管理", "用户", "安全"]
      },
      {
        "id": 12,
        "categoryId": "mysql",
        "title": "如何使用MySQL的日期函数？",
        "difficulty": "简单",
        "viewCount": 1678,
        "code": "SELECT CURDATE(), NOW(), DATE_ADD(create_time, INTERVAL 1 DAY) FROM table;",
        "md": "# 日期函数\n\nMySQL提供了丰富的日期和时间函数，可以方便地对日期和时间进行操作。\n\n## 常用函数\n- **CURDATE()**：返回当前日期。\n- **NOW()**：返回当前日期和时间。\n- **DATE_ADD(date, INTERVAL expr unit)**：将指定的时间间隔添加到日期中。\n- **DATEDIFF(date1, date2)**：计算两个日期之间的天数差。\n- **DATE_FORMAT(date, format)**：按照指定的格式格式化日期。\n\n## 示例\n获取当前日期和时间，并计算某个日期的前一天：\n```sql\nSELECT CURDATE(), NOW(), DATE_SUB(create_time, INTERVAL 1 DAY) FROM table;\n```\n\n## 应用场景\n- **报表生成**：在生成日报、月报、年报时，对日期进行格式化和计算。\n- **数据统计**：根据日期范围统计数据，例如统计某个月的销售额。\n- **任务调度**：在任务调度中，根据日期和时间安排任务的执行。",
        "tags": ["日期函数", "时间", "SQL"]
      },
      {
        "id": 13,
        "categoryId": "mysql",
        "title": "如何使用MySQL的聚合函数进行数据统计？",
        "difficulty": "中等",
        "viewCount": 2345,
        "code": "SELECT COUNT(*), SUM(salary), AVG(salary), MIN(salary), MAX(salary) FROM employees;",
        "md": "# 聚合函数\n\nMySQL的聚合函数用于对一组值进行计算，并返回单个结果。\n\n## 常用函数\n- **COUNT(expr)**：计算符合条件的行数。\n- **SUM(expr)**：计算表达式的总和。\n- **AVG(expr)**：计算表达式的平均值。\n- **MIN(expr)**：计算表达式的最小值。\n- **MAX(expr)**：计算表达式的最大值。\n\n## 示例\n统计员工表中的员工数量、工资总和、平均工资、最低工资和最高工资：\n```sql\nSELECT COUNT(*), SUM(salary), AVG(salary), MIN(salary), MAX(salary) FROM employees;\n```\n\n## 分组统计\n使用`GROUP BY`可以按照一个或多个列对数据进行分组，然后对每个分组应用聚合函数：\n```sql\nSELECT department_id, COUNT(*), AVG(salary)\nFROM employees\nGROUP BY department_id;\n```\n\n## 过滤分组\n使用`HAVING`可以对分组后的结果进行过滤：\n```sql\nSELECT department_id, COUNT(*), AVG(salary)\nFROM employees\nGROUP BY department_id\nHAVING COUNT(*) > 10;\n```\n\n## 应用场景\n- **数据分析**：对业务数据进行统计分析，例如销售数据、用户行为数据等。\n- **报表生成**：生成各种统计报表，例如财务报表、运营报表等。\n- **决策支持**：为管理层提供数据支持，帮助做出决策。",
        "tags": ["聚合函数", "数据统计", "SQL"]
      },
      {
        "id": 14,
        "categoryId": "mysql",
        "title": "如何使用MySQL的事务处理？",
        "difficulty": "中等",
        "viewCount": 2567,
        "code": "START TRANSACTION; UPDATE accounts SET balance = balance - 100 WHERE user_id = 1; UPDATE accounts SET balance = balance + 100 WHERE user_id = 2; COMMIT;",
        "md": "# 事务处理\n\n事务是一组操作的集合，这些操作要么全部成功，要么全部失败，用于保证数据的一致性和完整性。\n\n## 开始事务\n使用`START TRANSACTION`或`BEGIN`开始一个事务：\n```sql\nSTART TRANSACTION;\n```\n\n## 提交事务\n使用`COMMIT`提交事务，使所有操作永久生效：\n```sql\nCOMMIT;\n```\n\n## 回滚事务\n使用`ROLLBACK`回滚事务，撤销所有操作：\n```sql\nROLLBACK;\n```\n\n## 示例\n模拟银行转账操作：\n```sql\nSTART TRANSACTION;\nUPDATE accounts SET balance = balance - 100 WHERE user_id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE user_id = 2;\nCOMMIT;\n```\n\n## 事务特性\n- **原子性**：事务中的所有操作要么全部成功，要么全部失败。\n- **一致性**：事务执行前后，数据库处于一致的状态。\n- **隔离性**：多个事务之间相互隔离，互不干扰。\n- **持久性**：事务提交后，其结果是永久性的，即使系统发生故障也不会丢失。\n\n## 应用场景\n- **金融系统**：银行转账、股票交易等需要保证资金安全和数据一致性的场景。\n- **电商系统**：订单创建、库存扣减等需要保证业务完整性的情境。\n- **数据更新**：批量更新数据时，防止部分更新导致的数据不一致。",
        "tags": ["事务", "ACID", "SQL"]
      },
      {
        "id": 15,
        "categoryId": "mysql",
        "title": "如何使用MySQL的连接查询？",
        "difficulty": "中等",
        "viewCount": 2789,
        "code": "SELECT * FROM table1 INNER JOIN table2 ON table1.common_field = table2.common_field;",
        "md": "# 连接查询\n\n连接查询用于将两个或多个表中的数据按照某种条件进行组合，返回满足条件的行。\n\n## 内连接\n内连接返回两个表中满足连接条件的行：\n```sql\nSELECT * FROM table1 INNER JOIN table2 ON table1.common_field = table2.common_field;\n```\n\n## 左连接\n左连接返回左表中的所有行，以及右表中满足连接条件的行，如果右表没有匹配的行，则返回NULL：\n```sql\nSELECT * FROM table1 LEFT JOIN table2 ON table1.common_field = table2.common_field;\n```\n\n## 右连接\n右连接返回右表中的所有行，以及左表中满足连接条件的行，如果左表没有匹配的行，则返回NULL：\n```sql\nSELECT * FROM table1 RIGHT JOIN table2 ON table1.common_field = table2.common_field;\n```\n\n## 全连接\n全连接返回两个表中所有行的组合，如果某个表中没有匹配的行，则返回NULL：\n```sql\nSELECT * FROM table1 FULL JOIN table2 ON table1.common_field = table2.common_field;\n```\n\n## 多表连接\n可以连接多个表，按照业务需求进行数据组合：\n```sql\nSELECT * FROM table1\nJOIN table2 ON table1.common_field = table2.common_field\nJOIN table3 ON table2.common_field = table3.common_field;\n```\n\n## 应用场景\n- **数据整合**：将分散在多个表中的数据整合到一起，方便查询和分析。\n- **复杂报表**：生成复杂的报表，需要从多个表中获取数据。\n- **数据关联**：根据业务逻辑，将相关联的数据进行关联查询，例如订单和用户信息。",
        "tags": ["连接查询", "SQL", "数据整合"]
      },
      {
        "id": 16,
        "categoryId": "mysql",
        "title": "如何使用MySQL的子查询？",
        "difficulty": "中等",
        "viewCount": 2678,
        "code": "SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);",
        "md": "# 子查询\n\n子查询是在另一个查询内部的查询，可以用于更灵活的数据查询和操作。\n\n## 子查询作为条件\n子查询可以用于`WHERE`子句中，作为条件的一部分：\n```sql\nSELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);\n```\n\n## 子查询作为数据源\n子查询可以用于`FROM`子句中，作为数据源：\n```sql\nSELECT * FROM (SELECT * FROM employees WHERE department_id = 1) AS subquery;\n```\n\n## 子查询作为表达式\n子查询可以用于`SELECT`子句中，作为表达式的一部分：\n```sql\nSELECT name, (SELECT COUNT(*) FROM orders WHERE employees.id = orders.employee_id) AS order_count FROM employees;\n```\n\n## 子查询的类型\n- **单行子查询**：子查询返回单个值。\n- **多行子查询**：子查询返回多行单列的值。\n- **多列子查询**：子查询返回多行多列的值。\n\n## 应用场景\n- **复杂查询**：当查询条件复杂，无法用简单的连接查询实现时，可以使用子查询。\n- **数据比较**：将表中的数据与子查询的结果进行比较，例如大于、小于、等于等。\n- **数据汇总**：在查询中嵌套汇总数据，例如计算某个指标的平均值、总和等。",
        "tags": ["子查询", "SQL", "灵活查询"]
      },
      {
        "id": 17,
        "categoryId": "mysql",
        "title": "如何使用MySQL的索引优化查询？",
        "difficulty": "中等",
        "viewCount": 2890,
        "code": "CREATE INDEX idx_column ON table (column);",
        "md": "# 索引优化查询\n\n索引是数据库中用于提高查询速度的数据结构，通过在表的列上创建索引，可以加快查询操作的执行速度。\n\n## 创建索引\n使用`CREATE INDEX`语句可以创建索引：\n```sql\nCREATE INDEX idx_column ON table (column);\n```\n\n## 删除索引\n使用`DROP INDEX`语句可以删除索引：\n```sql\nDROP INDEX idx_column ON table;\n```\n\n## 索引类型\n- **单列索引**：在单个列上创建索引。\n- **复合索引**：在多个列上创建索引，查询时会按照索引列的顺序进行匹配。\n- **唯一索引**：索引列的值必须唯一，可以用于保证数据的唯一性。\n- **全文索引**：用于全文检索，可以快速查找文本中的关键词。\n\n## 索引的使用场景\n- **频繁查询的列**：在经常用于查询条件的列上创建索引，例如`WHERE`子句中的列。\n- **连接查询的列**：在连接查询中用于连接条件的列上创建索引，可以加快连接速度。\n- **排序和分组的列**：在`ORDER BY`和`GROUP BY`子句中使用的列上创建索引，可以优化排序和分组操作。\n\n## 索引的缺点\n- **增加存储空间**：索引需要额外的存储空间，特别是对于大型表。\n- **影响插入、更新和删除性能**：在插入、更新和删除数据时，需要同时维护索引，会增加操作的时间。\n- **过度索引**：过多的索引会导致维护成本增加，可能反而降低性能。",
        "tags": ["索引", "性能优化", "SQL"]
      },
      {
        "id": 18,
        "categoryId": "mysql",
        "title": "如何使用MySQL的分区表？",
        "difficulty": "中等",
        "viewCount": 2456,
        "code": "CREATE TABLE table (id INT, date DATE) PARTITION BY RANGE (YEAR(date)) (PARTITION p0 VALUES LESS THAN (2020), PARTITION p1 VALUES LESS THAN (2025));",
        "md": "# 分区表\n\n分区表是将一个大的表按照某种规则划分为多个小的分区，每个分区可以独立管理，提高查询性能和管理效率。\n\n## 按范围分区\n按照某个列的值范围进行分区：\n```sql\nCREATE TABLE table (id INT, date DATE)\nPARTITION BY RANGE (YEAR(date)) (\n  PARTITION p0 VALUES LESS THAN (2020),\n  PARTITION p1 VALUES LESS THAN (2025)\n);\n```\n\n## 按列表分区\n按照某个列的值列表进行分区：\n```sql\nCREATE TABLE table (id INT, type VARCHAR(10))\nPARTITION BY LIST (type) (\n  PARTITION p0 VALUES IN ('type1', 'type2'),\n  PARTITION p1 VALUES IN ('type3', 'type4')\n);\n```\n\n## 按哈希分区\n按照某个列的哈希值进行分区：\n```sql\nCREATE TABLE table (id INT)\nPARTITION BY HASH (id)\nPARTITIONS 4;\n```\n\n## 分区的优点\n- **提高查询性能**：查询时只需要扫描相关的分区，减少数据扫描量。\n- **简化管理**：可以对单个分区进行维护操作，例如备份、清理等。\n- **数据分布**：可以将数据分布在不同的存储设备上，提高存储效率。\n\n## 分区的适用场景\n- **大数据量表**：当表的数据量非常大时，分区可以提高管理和查询效率。\n- **数据生命周期管理**：可以按照时间或其他规则对数据进行分区，方便数据的归档和删除。\n- **性能优化**：对于频繁按照某个列进行查询的表，分区可以提高查询性能。",
        "tags": ["分区表", "性能优化", "SQL"]
      },
      {
        "id": 19,
        "categoryId": "mysql",
        "title": "如何使用MySQL的全文检索？",
        "difficulty": "中等",
        "viewCount": 2345,
        "code": "SELECT * FROM articles WHERE MATCH(content) AGAINST('keyword');",
        "md": "# 全文检索\n\n全文检索用于在文本数据中快速查找关键词，适用于大量的文本数据搜索。\n\n## 创建全文索引\n在需要进行全文检索的列上创建全文索引：\n```sql\nCREATE FULLTEXT INDEX idx_content ON articles (content);\n```\n\n## 使用全文检索\n使用`MATCH ... AGAINST`语法进行全文检索：\n```sql\nSELECT * FROM articles WHERE MATCH(content) AGAINST('keyword');\n```\n\n## 检索模式\n- **自然语言模式**：默认模式，根据关键词的相关性返回结果。\n- **布尔模式**：支持更复杂的查询语法，例如加号表示必须包含，减号表示必须不包含。\n\n## 示例（布尔模式）\n搜索包含'keyword1'但不包含'keyword2'的文章：\n```sql\nSELECT * FROM articles WHERE MATCH(content) AGAINST('+keyword1 -keyword2' IN BOOLEAN MODE);\n```\n\n## 全文检索的优点\n- **高效搜索**：可以快速在大量文本数据中查找关键词，比LIKE操作符更高效。\n- **相关性排序**：根据关键词的相关性对结果进行排序，返回最匹配的结果。\n- **支持复杂查询**：布尔模式支持复杂的查询语法，可以满足多种搜索需求。\n\n## 应用场景\n- **搜索引擎**：在网站或应用中实现搜索功能，快速查找文章、产品等。\n- **数据分析**：在大量的文本数据中查找特定信息，例如日志分析、社交媒体数据挖掘等。\n- **内容管理系统**：在内容管理系统中，快速检索文章、页面等。",
        "tags": ["全文检索", "文本搜索", "SQL"]
      },
      {
        "id": 20,
        "categoryId": "mysql",
        "title": "如何使用MySQL的事件调度器？",
        "difficulty": "中等",
        "viewCount": 2123,
        "code": "CREATE EVENT event_name ON SCHEDULE EVERY 1 DAY DO BEGIN ... END;",
        "md": "# 事件调度器\n\n事件调度器可以按照预定的时间间隔或特定时间执行SQL代码，用于实现定时任务。\n\n## 创建事件\n使用`CREATE EVENT`语句可以创建事件：\n```sql\nCREATE EVENT event_name\nON SCHEDULE EVERY 1 DAY\nDO\nBEGIN\n  -- SQL语句\nEND;\n```\n\n## 启用事件调度器\n默认情况下，事件调度器是禁用的，需要通过以下命令启用：\n```sql\nSET GLOBAL event_scheduler = ON;\n```\n\n## 示例\n每天凌晨2点清理日志表：\n```sql\nCREATE EVENT clean_logs\nON SCHEDULE AT EVERY 1 DAY STARTS '2024-01-01 02:00:00'\nDO\nBEGIN\n  DELETE FROM logs WHERE log_time < DATE_SUB(NOW(), INTERVAL 7 DAY);\nEND;\n```\n\n## 事件调度器的优点\n- **自动化**：可以自动执行定时任务，无需人工干预。\n- **灵活性**：可以设置复杂的调度计划，例如每天、每周、每月或特定时间执行。\n- **可靠性**：即使应用程序崩溃或重启，事件调度器仍然可以按照计划执行任务。\n\n## 应用场景\n- **数据备份**：定期备份数据库，确保数据安全。\n- **数据清理**：定期清理过期数据，释放存储空间。\n- **统计分析**：定期生成统计报表，为决策提供支持。",
        "tags": ["事件调度器", "定时任务", "SQL"]
      },
      {
        "id": 21,
        "categoryId": "mysql",
        "title": "如何使用MySQL的事务隔离级别？",
        "difficulty": "中等",
        "viewCount": 2456,
        "code": "SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;",
        "md": "# 事务隔离级别\n\n事务隔离级别决定了在一个事务中能够看到其他事务所做的更改的程度，不同的隔离级别会引发不同的并发问题。\n\n## 隔离级别\n- **读未提交(READ UNCOMMITTED)**：最低的隔离级别，允许脏读，即一个事务可以读取另一个事务未提交的数据。\n- **读已提交(READ COMMITTED)**：一个事务只能读取另一个事务已经提交的数据，避免脏读，但可能出现不可重复读和幻读。\n- **可重复读(REPEATABLE READ)**：在同一个事务中，多次读取相同的数据集时，结果一致，避免不可重复读，但可能出现幻读。\n- **串行化(SERIALIZABLE)**：最高的隔离级别，完全隔离各个事务，避免脏读、不可重复读和幻读，但性能较低。\n\n## 设置隔离级别\n可以为会话或全局设置隔离级别：\n```sql\n-- 会话级别\nSET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;\n\n-- 全局级别\nSET GLOBAL TRANSACTION ISOLATION LEVEL READ COMMITTED;\n```\n\n## 隔离级别与并发问题\n| 隔离级别       | 脏读 | 不可重复读 | 幻读 |\n|----------------|------|------------|------|\n| READ UNCOMMITTED | ✔️   | ✔️         | ✔️   |\n| READ COMMITTED   | ✖️   | ✔️         | ✔️   |\n| REPEATABLE READ  | ✖️   | ✖️         | ✔️   |\n| SERIALIZABLE     | ✖️   | ✖️         | ✖️   |\n\n## 应用场景\n- **金融系统**：通常使用串行化隔离级别，确保数据的绝对一致性。\n- **电商系统**：可重复读隔离级别可以满足大部分需求，既能保证数据一致性，又能保持较好的性能。\n- **数据分析**：读已提交隔离级别可以避免脏读，同时允许其他事务的提交数据被读取，提高查询效率。",
        "tags": ["事务", "隔离级别", "并发控制"]
      },
      {
        "id": 22,
        "categoryId": "mysql",
        "title": "如何使用MySQL的外键约束？",
        "difficulty": "中等",
        "viewCount": 2345,
        "code": "CREATE TABLE table1 (id INT PRIMARY KEY, foreign_id INT, FOREIGN KEY (foreign_id) REFERENCES table2(id));",
        "md": "# 外键约束\n\n外键约束用于在两个表之间建立引用关系，确保数据的完整性和一致性。\n\n## 创建外键约束\n在创建表时可以定义外键约束：\n```sql\nCREATE TABLE table1 (\n  id INT PRIMARY KEY,\n  foreign_id INT,\n  FOREIGN KEY (foreign_id) REFERENCES table2(id)\n);\n```\n\n## 添加外键约束\n对于已存在的表，可以使用`ALTER TABLE`添加外键约束：\n```sql\nALTER TABLE table1\nADD FOREIGN KEY (foreign_id) REFERENCES table2(id);\n```\n\n## 删除外键约束\n使用`ALTER TABLE`删除外键约束：\n```sql\nALTER TABLE table1\nDROP FOREIGN KEY fk_name;\n```\n\n## 外键约束的作用\n- **数据完整性**：确保引用的数据在被引用的表中存在，防止出现孤立的记录。\n- **级联操作**：当被引用的记录被删除或更新时，可以自动对引用的记录进行相应的操作，例如级联删除、设置为NULL等。\n\n## 应用场景\n- **关联数据**：在具有关联关系的表之间，如订单表和用户表，使用外键约束确保订单始终关联到有效的用户。\n- **数据维护**：在维护数据时，外键约束可以自动处理相关的数据，减少手动操作的错误。\n- **数据一致性**：在多用户并发操作时，外键约束可以防止数据的不一致，提高数据的可靠性。",
        "tags": ["外键", "数据完整性", "SQL"]
      },
      {
        "id": 23,
        "categoryId": "mysql",
        "title": "如何使用MySQL的事务日志？",
        "difficulty": "中等",
        "viewCount": 2123,
        "code": "SHOW VARIABLES LIKE 'log_bin';",
        "md": "# 事务日志\n\n事务日志用于记录事务的操作，用于数据库的恢复和复制。\n\n## 二进制日志(Binary Log)\n二进制日志记录了所有更改数据的SQL语句，用于数据库的备份和恢复，以及主从复制。\n\n## 检查二进制日志是否启用\n```sql\nSHOW VARIABLES LIKE 'log_bin';\n```\n\n## 查看二进制日志内容\n```sql\nSHOW BINLOG EVENTS;\n```\n\n## 重做日志(Redo Log)\n重做日志记录了事务中对数据的修改操作，用于在系统崩溃后恢复未写入磁盘的数据。\n\n## 撤销日志(Undo Log)\n撤销日志记录了事务中对数据的修改前的值，用于在事务回滚时恢复数据。\n\n## 应用场景\n- **数据恢复**：在系统崩溃或数据损坏时，使用二进制日志和重做日志恢复数据。\n- **主从复制**：主服务器将二进制日志发送给从服务器，从服务器重放日志实现数据同步。\n- **审计**：通过分析二进制日志，可以了解数据库的操作历史，用于审计和故障排查。",
        "tags": ["事务日志", "数据恢复", "复制"]
      },
      {
        "id": 24,
        "categoryId": "mysql",
        "title": "如何使用MySQL的存储过程进行批量操作？",
        "difficulty": "中等",
        "viewCount": 2567,
        "code": "CREATE PROCEDURE batch_update() BEGIN ... END;",
        "md": "# 批量操作\n\n存储过程可以用于执行批量操作，提高操作效率，减少网络传输。\n\n## 示例：批量更新\n创建一个存储过程，用于批量更新员工的工资：\n```sql\nCREATE PROCEDURE batch_update()\nBEGIN\n  DECLARE done INT DEFAULT 0;\n  DECLARE cur CURSOR FOR SELECT id FROM employees;\n  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;\n\n  OPEN cur;\n\n  read_loop: LOOP\n    FETCH cur INTO @emp_id;\n    IF done THEN\n      LEAVE read_loop;\n    END IF;\n    UPDATE employees SET salary = salary * 1.1 WHERE id = @emp_id;\n  END LOOP;\n\n  CLOSE cur;\nEND;\n```\n\n## 调用存储过程\n```sql\nCALL batch_update();\n```\n\n## 批量操作的优点\n- **效率高**：批量操作可以减少与数据库的交互次数，提高执行效率。\n- **事务支持**：批量操作可以在事务中执行，确保操作的原子性和一致性。\n- **代码复用**：存储过程可以被多个应用程序调用，避免重复编写相同的批量操作代码。\n\n## 应用场景\n- **数据迁移**：在系统升级或数据迁移时，批量处理数据，提高迁移效率。\n- **数据更新**：对大量数据进行更新操作，例如调整价格、更新状态等。\n- **数据初始化**：在系统初始化时，批量插入初始数据，加快初始化过程。",
        "tags": ["存储过程", "批量操作", "SQL"]
      },
      {
        "id": 25,
        "categoryId": "mysql",
        "title": "如何使用MySQL的视图进行数据安全控制？",
        "difficulty": "中等",
        "viewCount": 2345,
        "code": "CREATE VIEW secure_view AS SELECT id, name FROM users WHERE department = 'HR';",
        "md": "# 视图与数据安全\n\n视图可以用于控制用户对数据的访问，提高数据的安全性。\n\n## 创建安全视图\n创建一个视图，只暴露特定的列和行给用户：\n```sql\nCREATE VIEW secure_view AS\nSELECT id, name\nFROM users\nWHERE department = 'HR';\n```\n\n## 授予权限\n将对视图的访问权限授给用户，而不授予权限访问底层的表：\n```sql\nGRANT SELECT ON database.secure_view TO 'user'@'host';\n```\n\n## 视图的安全性优点\n- **数据隐藏**：视图可以隐藏底层表的结构和数据，用户只能通过视图看到特定的数据。\n- **细粒度控制**：可以按照部门、角色等条件对数据进行过滤，实现细粒度的访问控制。\n- **简化权限管理**：通过视图，可以将复杂的权限管理简化为对视图的权限管理。\n\n## 应用场景\n- **敏感数据保护**：对于包含敏感信息的表，如员工薪资表，可以通过视图只暴露非敏感信息。\n- **多租户系统**：在多租户系统中，每个租户只能通过视图访问自己的数据。\n- **数据共享**：在需要将部分数据共享给外部系统或用户时，可以通过视图提供安全的数据访问。",
        "tags": ["视图", "数据安全", "权限管理"]
      },
      {
        "id": 26,
        "categoryId": "mysql",
        "title": "如何使用MySQL的触发器审计数据更改？",
        "difficulty": "中等",
        "viewCount": 2123,
        "code": "CREATE TRIGGER audit_update BEFORE UPDATE ON table FOR EACH ROW INSERT INTO audit_log ...;",
        "md": "# 触发器与数据审计\n\n触发器可以在数据更改时自动记录操作日志，用于审计和追踪。\n\n## 创建审计触发器\n创建一个触发器，在更新表时记录更改前后的数据：\n```sql\nCREATE TRIGGER audit_update\nBEFORE UPDATE\nON table\nFOR EACH ROW\nBEGIN\n  INSERT INTO audit_log (\n    log_time,\n    table_name,\n    record_id,\n    old_value,\n    new_value,\n    action_type\n  ) VALUES (\n    NOW(),\n    'table',\n    OLD.id,\n    OLD.column,\n    NEW.column,\n    'UPDATE'\n  );\nEND;\n```\n\n## 审计日志表结构\n审计日志表通常包含以下列：\n- **log_time**：记录操作的时间。\n- **table_name**：被操作的表名。\n- **record_id**：被操作的记录ID。\n- **old_value**：更改前的值。\n- **new_value**：更改后的值。\n- **action_type**：操作类型，如INSERT、UPDATE、DELETE。\n\n## 触发器的优点\n- **自动记录**：触发器可以自动执行，无需手动调用，确保所有数据更改都被记录。\n- **完整性**：记录了所有数据更改的操作，方便后续的审计和分析。\n- **实时性**：在数据更改的同时记录日志，保证日志的及时性。\n\n## 应用场景\n- **数据追踪**：在需要对数据更改进行追踪的系统中，如金融系统、医疗系统等。\n- **合规性**：满足法律法规对数据审计的要求，如GDPR、HIPAA等。\n- **故障排查**：当系统出现故障或数据异常时，可以通过审计日志快速定位问题。",
        "tags": ["触发器", "数据审计", "SQL"]
      },
      {
        "id": 27,
        "categoryId": "mysql",
        "title": "如何使用MySQL的索引进行排序和分组优化？",
        "difficulty": "中等",
        "viewCount": 2456,
        "code": "SELECT * FROM employees ORDER BY salary DESC;",
        "md": "# 排序和分组优化\n\n通过在排序和分组的列上创建索引，可以显著提高查询性能。\n\n## 排序优化\n在需要排序的列上创建索引，MySQL可以利用索引进行快速排序：\n```sql\nCREATE INDEX idx_salary ON employees (salary);\n\nSELECT * FROM employees ORDER BY salary DESC;\n```\n\n## 分组优化\n在分组的列上创建索引，可以加快分组操作的速度：\n```sql\nCREATE INDEX idx_department ON employees (department_id);\n\nSELECT department_id, AVG(salary) FROM employees GROUP BY department_id;\n```\n\n## 索引的使用技巧\n- **多列索引**：如果查询中同时包含排序和分组操作，可以创建多列索引，按照查询的列顺序排列。\n- **避免冗余索引**：在创建索引时，要避免创建冗余的索引，以免增加维护成本。\n- **定期分析**：定期分析索引的使用情况，根据查询需求调整索引策略。\n\n## 应用场景\n- **报表生成**：在生成需要排序和分组的报表时，通过索引优化查询性能。\n- **数据分析**：在进行数据分析时，对大量的数据进行排序和分组，索引可以提高操作的效率。\n- **搜索功能**：在搜索结果中按照某些条件进行排序，提高用户体验。",
        "tags": ["索引", "排序", "分组", "性能优化"]
      },
      {
        "id": 28,
        "categoryId": "mysql",
        "title": "如何使用MySQL的连接查询进行多表数据整合？",
        "difficulty": "中等",
        "viewCount": 2678,
        "code": "SELECT users.name, orders.order_id, products.product_name FROM users JOIN orders ON users.id = orders.user_id JOIN products ON orders.product_id = products.id;",
        "md": "# 多表数据整合\n\n通过连接查询，可以将多个表中的数据按照业务需求进行整合，返回完整的结果集。\n\n## 多表连接示例\n将用户表、订单表和产品表连接起来，获取用户的订单信息和对应的产品名称：\n```sql\nSELECT users.name, orders.order_id, products.product_name\nFROM users\nJOIN orders ON users.id = orders.user_id\nJOIN products ON orders.product_id = products.id;\n```\n\n## 连接查询的优化\n- **索引优化**：在连接条件的列上创建索引，加快连接速度。\n- **减少列数**：只选择需要的列，减少数据传输量。\n- **避免多表连接**：如果可能，尽量减少连接的表数，简化查询。\n\n## 应用场景\n- **复杂报表**：生成需要从多个表中获取数据的复杂报表。\n- **数据整合**：将分散在多个表中的数据整合到一起，提供完整的业务视图。\n- **数据关联**：根据业务逻辑，将相关联的数据进行关联查询，例如订单和用户信息、产品和库存信息等。",
        "tags": ["连接查询", "数据整合", "SQL"]
      },
      {
        "id": 29,
        "categoryId": "mysql",
        "title": "如何使用MySQL的子查询进行数据比较？",
        "difficulty": "中等",
        "viewCount": 2567,
        "code": "SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);",
        "md": "# 子查询与数据比较\n\n子查询可以用于将表中的数据与子查询的结果进行比较，实现复杂的查询条件。\n\n## 示例：比较工资\n查询工资高于平均工资的员工：\n```sql\nSELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);\n```\n\n## 子查询的灵活性\n子查询可以在`WHERE`、`FROM`、`SELECT`等子句中使用，提供灵活的查询方式。\n\n## 性能考虑\n- **避免复杂子查询**：复杂的子查询可能影响性能，可以尝试用连接查询或其他方式优化。\n- **索引优化**：在子查询中涉及的列上创建索引，提高查询效率。\n\n## 应用场景\n- **数据筛选**：根据子查询的结果筛选数据，例如查找高于平均值的记录。\n- **数据关联**：将子查询的结果与其他表进行关联，获取更丰富的信息。\n- **动态数据**：子查询可以动态计算条件，适应变化的数据环境。",
        "tags": ["子查询", "数据比较", "SQL"]
      },
      {
        "id": 30,
        "categoryId": "mysql",
        "title": "如何使用MySQL的存储过程实现复杂业务逻辑？",
        "difficulty": "中等",
        "viewCount": 2345,
        "code": "CREATE PROCEDURE complex_logic() BEGIN ... END;",
        "md": "# 存储过程与复杂业务逻辑\n\n存储过程可以用于实现复杂的业务逻辑，将多个SQL操作封装在一起，提高代码的复用性和执行效率。\n\n## 示例：复杂业务逻辑\n创建一个存储过程，用于处理订单的创建、库存扣减和日志记录：\n```sql\nCREATE PROCEDURE create_order(\n  IN user_id INT,\n  IN product_id INT,\n  IN quantity INT\n)\nBEGIN\n  DECLARE product_stock INT;\n  DECLARE order_id INT;\n\n  -- 检查库存\n  SELECT stock INTO product_stock FROM products WHERE id = product_id;\n  IF product_stock < quantity THEN\n    SIGNAL SQLSTATE '45000'\n    SET MESSAGE_TEXT = '库存不足';\n  END IF;\n\n  -- 创建订单\n  INSERT INTO orders (user_id, product_id, quantity, order_time)\n  VALUES (user_id, product_id, quantity, NOW());\n  SET order_id = LAST_INSERT_ID();\n\n  -- 扣减库存\n  UPDATE products SET stock = stock - quantity WHERE id = product_id;\n\n  -- 记录日志\n  INSERT INTO order_logs (order_id, log_time, message)\n  VALUES (order_id, NOW(), '订单创建成功');\nEND;\n```\n\n## 调用存储过程\n```sql\nCALL create_order(1, 101, 2);\n```\n\n## 存储过程的优点\n- **代码复用**：存储过程可以被多个应用程序调用，避免重复编写相同的业务逻辑。\n- **性能提升**：存储过程在创建时会被编译，执行速度比单条SQL语句更快。\n- **事务支持**：存储过程中的操作可以在事务中执行，确保业务逻辑的原子性和一致性。\n- **安全性**：可以通过权限控制谁可以调用存储过程，提高数据库的安全性。\n\n## 应用场景\n- **复杂业务操作**：在需要多个步骤完成的业务操作中，如订单创建、资金转账等。\n- **数据完整性**：存储过程可以确保数据的完整性，例如在扣减库存时检查库存是否充足。\n- **代码维护**：将业务逻辑集中在存储过程中，便于统一维护和更新。",
        "tags": ["存储过程", "业务逻辑", "SQL"]
      },
      {
        "id": 31,
        "categoryId": "mysql",
        "title": "SQL的执行顺序是什么？",
        "difficulty": "简单",
        "viewCount": 3456,
        "code": "",
        "md": "# SQL执行顺序\n\nSQL查询的执行顺序如下：\n\n1. **FROM**：首先处理FROM子句，确定要查询的数据表。\n2. **WHERE**：对FROM子句中的表进行条件筛选。\n3. **GROUP BY**：将WHERE子句筛选后的结果按照指定的列进行分组。\n4. **HAVING**：对GROUP BY分组后的结果进行条件筛选。\n5. **SELECT**：选择需要的列。\n6. **ORDER BY**：对SELECT子句选择的结果进行排序。\n7. **LIMIT**：限制最终返回的结果数量。\n\n## 示例\n```sql\nSELECT column1, column2\nFROM table\nWHERE condition\nGROUP BY column1\nHAVING condition\nORDER BY column1\nLIMIT number;\n```\n\n## 注意事项\n- **执行顺序与书写顺序不同**：SQL语句的书写顺序通常是SELECT、FROM、WHERE等，但实际执行顺序如上述所示。\n- **理解执行顺序有助于优化查询**：了解执行顺序可以帮助我们更好地编写和优化SQL查询，例如在WHERE子句中尽量使用索引列进行筛选，减少GROUP BY和ORDER BY的操作量。",
        "tags": ["SQL", "执行顺序", "查询优化"]
      },
      {
        "id": 32,
        "categoryId": "mysql",
        "title": "如何优化MySQL查询？",
        "difficulty": "简单",
        "viewCount": 3456,
        "code": "EXPLAIN SELECT * FROM table WHERE column = 'value';",
        "md": "# 查询性能优化\n\n## 分析查询性能\n使用`EXPLAIN`关键字可以查看查询的执行计划，分析查询性能：\n```sql\nEXPLAIN SELECT * FROM table WHERE column = 'value';\n```\n\n## 优化技巧\n- **添加索引**：在查询条件中使用的列上添加索引，可以大大加快查询速度。\n- **避免使用`SELECT *`**：只查询需要的列，减少数据传输量，提高查询效率。\n- **减少子查询**：子查询可能导致性能下降，尽量用连接查询替代，因为连接查询通常更高效。\n- **分页优化**：合理设置分页参数，避免查询过大范围的数据，减少服务器负担。\n- **避免在WHERE子句中使用函数**：这会导致无法使用索引，从而降低查询性能。\n- **使用缓存机制**：对于频繁查询且数据变化不频繁的数据，可以使用缓存来减少数据库的访问次数。",
        "tags": ["性能优化", "查询优化", "EXPLAIN"]
      },
      {
        "id": 33,
        "categoryId": "mysql",
        "title": "常用的聚合函数有哪些？",
        "difficulty": "简单",
        "viewCount": 2345,
        "code": "SELECT COUNT(*), SUM(column), AVG(column), MIN(column), MAX(column) FROM table;",
        "md": "# 常用聚合函数\n\nMySQL提供了多个聚合函数，用于对一组值进行计算并返回单个结果。\n\n## 常用函数\n- **COUNT(expr)**：计算符合条件的行数。\n- **SUM(expr)**：计算表达式的总和。\n- **AVG(expr)**：计算表达式的平均值。\n- **MIN(expr)**：计算表达式的最小值。\n- **MAX(expr)**：计算表达式的最大值。\n\n## 示例\n统计表中的行数、某一列的总和、平均值、最小值和最大值：\n```sql\nSELECT COUNT(*), SUM(column), AVG(column), MIN(column), MAX(column) FROM table;\n```\n\n## 分组统计\n使用`GROUP BY`可以按照一个或多个列对数据进行分组，然后对每个分组应用聚合函数：\n```sql\nSELECT group_column, COUNT(*), AVG(column)\nFROM table\nGROUP BY group_column;\n```\n\n## 过滤分组\n使用`HAVING`可以对分组后的结果进行过滤：\n```sql\nSELECT group_column, COUNT(*), AVG(column)\nFROM table\nGROUP BY group_column\nHAVING COUNT(*) > 10;\n```\n\n## 应用场景\n- **数据分析**：对业务数据进行统计分析，例如销售数据、用户行为数据等。\n- **报表生成**：生成各种统计报表，例如财务报表、运营报表等。\n- **决策支持**：为管理层提供数据支持，帮助做出决策。",
        "tags": ["聚合函数", "数据统计", "SQL"]
      },
      {
        "id": 34,
        "categoryId": "mysql",
        "title": "说明MySQL中InnoDB和MyISAM存储引擎的区别？",
        "difficulty": "简单",
        "viewCount": 2345,
        "code": "",
        "md": "# InnoDB与MyISAM区别\n\n## 事务支持\n- **InnoDB**：支持事务处理，具有ACID特性。\n- **MyISAM**：不支持事务处理。\n\n## 锁机制\n- **InnoDB**：行级锁，适合高并发场景。\n- **MyISAM**：表级锁，写操作会锁定整张表。\n\n## 性能\n- **InnoDB**：读写操作性能均衡，适合事务性应用。\n- **MyISAM**：读操作性能较高，适合读多写少的场景。\n\n## 存储限制\n- **InnoDB**：表大小几乎没有限制。\n- **MyISAM**：表大小有限制，通常为256TB。\n\n## 其他特性\n- **InnoDB**：支持外键约束。\n- **MyISAM**：不支持外键约束。\n\n## 选择引擎的建议\n- **需要事务支持**：选择InnoDB。\n- **高并发读写**：选择InnoDB。\n- **大量读操作**：可以选择MyISAM，但需谨慎评估写操作的频率和并发性。",
        "tags": ["存储引擎", "InnoDB", "MyISAM"]
      },
      {
        "id": 35,
        "categoryId": "mysql",
        "title": "写出一条SQL语句，将两个表按照某个字段进行左连接查询？",
        "difficulty": "简单",
        "viewCount": 1567,
        "code": "SELECT * FROM table1 LEFT JOIN table2 ON table1.common_field = table2.common_field;",
        "md": "# 左连接查询\n\n左连接查询用于将两个表按照指定字段进行连接，左表所有记录都会被保留，右表中没有匹配的字段会以NULL填充。\n\n## 基本语法\n```sql\nSELECT * FROM table1 LEFT JOIN table2 ON table1.common_field = table2.common_field;\n```\n\n## 示例\n假设我们有两个表：`employees`（员工表）和`departments`（部门表），我们想查询所有员工及其所在部门的信息，即使某些员工没有分配部门：\n```sql\nSELECT employees.name, departments.department_name\nFROM employees\nLEFT JOIN departments ON employees.department_id = departments.id;\n```\n\n## 应用场景\n- **数据整合**：将分散在多个表中的数据整合到一起，方便查询和分析。\n- **报表生成**：生成需要从多个表中获取数据的报表。\n- **数据关联**：根据业务逻辑，将相关联的数据进行关联查询，例如员工和部门信息。",
        "tags": ["连接查询", "SQL", "数据整合"]
      },
      {
        "id": 36,
        "categoryId": "mysql",
        "title": "如何创建存储过程？",
        "difficulty": "中等",
        "viewCount": 2567,
        "code": "CREATE PROCEDURE procedure_name() BEGIN ... END;",
        "md": "# 创建存储过程\n\n存储过程是一组SQL语句的集合，可以预先编译并保存在数据库中，便于重复调用。\n\n## 基本语法\n```sql\nCREATE PROCEDURE procedure_name()\nBEGIN\n  -- SQL语句\nEND;\n```\n\n## 示例\n创建一个简单的存储过程来查询用户信息：\n```sql\nCREATE PROCEDURE get_user_info()\nBEGIN\n  SELECT * FROM users;\nEND;\n```\n\n## 调用存储过程\n使用`CALL`语句来调用存储过程：\n```sql\nCALL get_user_info();\n```\n\n## 优点\n- **代码复用**：存储过程可以被多个应用程序调用，避免重复编写相同的SQL代码。\n- **性能提升**：存储过程在创建时会被编译，执行速度比单条SQL语句更快。\n- **安全性**：可以通过权限控制谁可以调用存储过程，提高数据库的安全性。",
        "tags": ["存储过程", "SQL", "编程"]
      },
      {
        "id": 37,
        "categoryId": "mysql",
        "title": "如何创建视图？",
        "difficulty": "简单",
        "viewCount": 1987,
        "code": "CREATE VIEW view_name AS SELECT ...;",
        "md": "# 创建视图\n\n视图是基于SQL语句的结果集的虚拟表，不存储实际的数据，而是存储查询的定义。\n\n## 基本语法\n```sql\nCREATE VIEW view_name AS\nSELECT column1, column2, ...\nFROM table_name\nWHERE condition;\n```\n\n## 示例\n创建一个视图来显示活跃用户：\n```sql\nCREATE VIEW active_users AS\nSELECT user_id, username\nFROM users\nWHERE status = 'active';\n```\n\n## 使用视图\n可以通过视图来查询数据，就像查询普通表一样：\n```sql\nSELECT * FROM active_users;\n```\n\n## 优点\n- **简化查询**：视图可以简化复杂的查询，特别是当查询涉及多个表的连接时。\n- **安全性**：可以通过视图只暴露部分数据给用户，而不暴露底层的表结构和数据。\n- **数据独立性**：视图的定义与底层表的结构分离，当表结构发生变化时，视图可以保持不变。",
        "tags": ["视图", "SQL", "虚拟表"]
      },
      {
        "id": 38,
        "categoryId": "mysql",
        "title": "如何创建触发器？",
        "difficulty": "中等",
        "viewCount": 2123,
        "code": "CREATE TRIGGER trigger_name BEFORE INSERT ON table FOR EACH ROW ...;",
        "md": "# 创建触发器\n\n触发器是在特定的数据库操作（如INSERT、UPDATE、DELETE）发生时自动执行的SQL代码。\n\n## 基本语法\n```sql\nCREATE TRIGGER trigger_name\nBEFORE INSERT\nON table_name\nFOR EACH ROW\nBEGIN\n  -- SQL语句\nEND;\n```\n\n## 示例\n创建一个触发器，在插入新用户时记录日志：\n```sql\nCREATE TRIGGER log_user_insert\nAFTER INSERT\nON users\nFOR EACH ROW\nBEGIN\n  INSERT INTO logs (log_time, user_id, action)\n  VALUES (NOW(), NEW.user_id, 'User inserted');\nEND;\n```\n\n## 触发时机\n- **BEFORE**：在执行INSERT、UPDATE或DELETE操作之前触发。\n- **AFTER**：在执行INSERT、UPDATE或DELETE操作之后触发。\n\n## 优点\n- **自动执行**：触发器可以自动执行，无需手动调用。\n- **数据完整性**：可以用于维护数据的完整性，例如在更新数据时自动检查某些条件。\n- **审计日志**：可以用于记录操作日志，方便后续的审计和分析。",
        "tags": ["触发器", "SQL", "自动化"]
      },
      {
        "id": 39,
        "categoryId": "mysql",
        "title": "如何使用MySQL的函数进行字符串处理？",
        "difficulty": "简单",
        "viewCount": 1789,
        "code": "SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM users;",
        "md": "# 字符串处理函数\n\nMySQL提供了丰富的字符串处理函数，可以方便地对字符串进行操作。\n\n## 常用函数\n- **CONCAT(str1, str2, ...)**：将多个字符串连接成一个字符串。\n- **LENGTH(str)**：返回字符串的长度。\n- **UPPER(str)**：将字符串转换为大写。\n- **LOWER(str)**：将字符串转换为小写。\n- **SUBSTRING(str, pos, len)**：从字符串中提取子字符串。\n- **REPLACE(str, search_str, replace_str)**：将字符串中的某个子字符串替换为另一个字符串。\n\n## 示例\n将用户表中的名字和姓氏连接成全名：\n```sql\nSELECT CONCAT(first_name, ' ', last_name) AS full_name FROM users;\n```\n\n## 应用场景\n- **数据清洗**：在数据导入或处理过程中，对字符串进行清洗和格式化。\n- **报表生成**：在生成报表时，对字符串进行格式化，使其更易于阅读。\n- **搜索功能**：在搜索功能中，对用户输入的关键词进行处理，提高搜索的准确性。",
        "tags": ["字符串处理", "函数", "SQL"]
      },
      {
        "id": 40,
        "categoryId": "mysql",
        "title": "如何管理MySQL用户权限？",
        "difficulty": "中等",
        "viewCount": 2456,
        "code": "GRANT SELECT, INSERT ON database.table TO 'user'@'host' IDENTIFIED BY 'password';",
        "md": "# 用户权限管理\n\nMySQL通过权限系统来控制用户对数据库的访问，确保数据的安全性。\n\n## 授予权限\n使用`GRANT`语句可以授予权限给用户：\n```sql\nGRANT SELECT, INSERT ON database.table TO 'user'@'host' IDENTIFIED BY 'password';\n```\n\n## 撤销权限\n使用`REVOKE`语句可以撤销用户的权限：\n```sql\nREVOKE SELECT, INSERT ON database.table FROM 'user'@'host';\n```\n\n## 查看用户权限\n可以查询`mysql.user`表或使用`SHOW GRANTS`语句来查看用户的权限：\n```sql\nSHOW GRANTS FOR 'user'@'host';\n```\n\n## 权限类型\n- **全局权限**：对所有数据库和表生效。\n- **数据库权限**：对特定数据库中的所有表生效。\n- **表权限**：对特定表生效。\n- **列权限**：对表中的特定列生效。\n\n## 优点\n- **细粒度控制**：可以精确控制用户对不同数据库、表、列的访问权限。\n- **安全性**：通过合理的权限分配，可以防止未授权的访问和数据泄露。\n- **灵活性**：可以根据用户的角色和需求灵活地授予权限。",
        "tags": ["权限管理", "用户", "安全"]
      },
      {
        "id": 41,
        "categoryId": "mysql",
        "title": "如何使用MySQL的日期函数？",
        "difficulty": "简单",
        "viewCount": 1678,
        "code": "SELECT CURDATE(), NOW(), DATE_ADD(create_time, INTERVAL 1 DAY) FROM table;",
        "md": "# 日期函数\n\nMySQL提供了丰富的日期和时间函数，可以方便地对日期和时间进行操作。\n\n## 常用函数\n- **CURDATE()**：返回当前日期。\n- **NOW()**：返回当前日期和时间。\n- **DATE_ADD(date, INTERVAL expr unit)**：将指定的时间间隔添加到日期中。\n- **DATEDIFF(date1, date2)**：计算两个日期之间的天数差。\n- **DATE_FORMAT(date, format)**：按照指定的格式格式化日期。\n\n## 示例\n获取当前日期和时间，并计算某个日期的前一天：\n```sql\nSELECT CURDATE(), NOW(), DATE_SUB(create_time, INTERVAL 1 DAY) FROM table;\n```\n\n## 应用场景\n- **报表生成**：在生成日报、月报、年报时，对日期进行格式化和计算。\n- **数据统计**：根据日期范围统计数据，例如统计某个月的销售额。\n- **任务调度**：在任务调度中，根据日期和时间安排任务的执行。",
        "tags": ["日期函数", "时间", "SQL"]
      },
      {
        "id": 42,
        "categoryId": "mysql",
        "title": "如何使用MySQL的聚合函数进行数据统计？",
        "difficulty": "中等",
        "viewCount": 2345,
        "code": "SELECT COUNT(*), SUM(salary), AVG(salary), MIN(salary), MAX(salary) FROM employees;",
        "md": "# 聚合函数\n\nMySQL的聚合函数用于对一组值进行计算，并返回单个结果。\n\n## 常用函数\n- **COUNT(expr)**：计算符合条件的行数。\n- **SUM(expr)**：计算表达式的总和。\n- **AVG(expr)**：计算表达式的平均值。\n- **MIN(expr)**：计算表达式的最小值。\n- **MAX(expr)**：计算表达式的最大值。\n\n## 示例\n统计员工表中的员工数量、工资总和、平均工资、最低工资和最高工资：\n```sql\nSELECT COUNT(*), SUM(salary), AVG(salary), MIN(salary), MAX(salary) FROM employees;\n```\n\n## 分组统计\n使用`GROUP BY`可以按照一个或多个列对数据进行分组，然后对每个分组应用聚合函数：\n```sql\nSELECT department_id, COUNT(*), AVG(salary)\nFROM employees\nGROUP BY department_id;\n```\n\n## 过滤分组\n使用`HAVING`可以对分组后的结果进行过滤：\n```sql\nSELECT department_id, COUNT(*), AVG(salary)\nFROM employees\nGROUP BY department_id\nHAVING COUNT(*) > 10;\n```\n\n## 应用场景\n- **数据分析**：对业务数据进行统计分析，例如销售数据、用户行为数据等。\n- **报表生成**：生成各种统计报表，例如财务报表、运营报表等。\n- **决策支持**：为管理层提供数据支持，帮助做出决策。",
        "tags": ["聚合函数", "数据统计", "SQL"]
      },
      {
        "id": 43,
        "categoryId": "mysql",
        "title": "如何使用MySQL的事务处理？",
        "difficulty": "中等",
        "viewCount": 2567,
        "code": "START TRANSACTION; UPDATE accounts SET balance = balance - 100 WHERE user_id = 1; UPDATE accounts SET balance = balance + 100 WHERE user_id = 2; COMMIT;",
        "md": "# 事务处理\n\n事务是一组操作的集合，这些操作要么全部成功，要么全部失败，用于保证数据的一致性和完整性。\n\n## 开始事务\n使用`START TRANSACTION`或`BEGIN`开始一个事务：\n```sql\nSTART TRANSACTION;\n```\n\n## 提交事务\n使用`COMMIT`提交事务，使所有操作永久生效：\n```sql\nCOMMIT;\n```\n\n## 回滚事务\n使用`ROLLBACK`回滚事务，撤销所有操作：\n```sql\nROLLBACK;\n```\n\n## 示例\n模拟银行转账操作：\n```sql\nSTART TRANSACTION;\nUPDATE accounts SET balance = balance - 100 WHERE user_id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE user_id = 2;\nCOMMIT;\n```\n\n## 事务特性\n- **原子性**：事务中的所有操作要么全部成功，要么全部失败。\n- **一致性**：事务执行前后，数据库处于一致的状态。\n- **隔离性**：多个事务之间相互隔离，互不干扰。\n- **持久性**：事务提交后，其结果是永久性的，即使系统发生故障也不会丢失。\n\n## 应用场景\n- **金融系统**：银行转账、股票交易等需要保证资金安全和数据一致性的场景。\n- **电商系统**：订单创建、库存扣减等需要保证业务完整性的情境。\n- **数据更新**：批量更新数据时，防止部分更新导致的数据不一致。",
        "tags": ["事务", "ACID", "SQL"]
      },
      {
        "id": 44,
        "categoryId": "mysql",
        "title": "如何使用MySQL的连接查询？",
        "difficulty": "中等",
        "viewCount": 2789,
        "code": "SELECT * FROM table1 INNER JOIN table2 ON table1.common_field = table2.common_field;",
        "md": "# 连接查询\n\n连接查询用于将两个或多个表中的数据按照某种条件进行组合，返回满足条件的行。\n\n## 内连接\n内连接返回两个表中满足连接条件的行：\n```sql\nSELECT * FROM table1 INNER JOIN table2 ON table1.common_field = table2.common_field;\n```\n\n## 左连接\n左连接返回左表中的所有行，以及右表中满足连接条件的行，如果右表没有匹配的行，则返回NULL：\n```sql\nSELECT * FROM table1 LEFT JOIN table2 ON table1.common_field = table2.common_field;\n```\n\n## 右连接\n右连接返回右表中的所有行，以及左表中满足连接条件的行，如果左表没有匹配的行，则返回NULL：\n```sql\nSELECT * FROM table1 RIGHT JOIN table2 ON table1.common_field = table2.common_field;\n```\n\n## 全连接\n全连接返回两个表中所有行的组合，如果某个表中没有匹配的行，则返回NULL：\n```sql\nSELECT * FROM table1 FULL JOIN table2 ON table1.common_field = table2.common_field;\n```\n\n## 多表连接\n可以连接多个表，按照业务需求进行数据组合：\n```sql\nSELECT * FROM table1\nJOIN table2 ON table1.common_field = table2.common_field\nJOIN table3 ON table2.common_field = table3.common_field;\n```\n\n## 应用场景\n- **数据整合**：将分散在多个表中的数据整合到一起，方便查询和分析。\n- **复杂报表**：生成复杂的报表，需要从多个表中获取数据。\n- **数据关联**：根据业务逻辑，将相关联的数据进行关联查询，例如订单和用户信息。",
        "tags": ["连接查询", "SQL", "数据整合"]
      },
      {
        "id": 45,
        "categoryId": "mysql",
        "title": "如何使用MySQL的子查询？",
        "difficulty": "中等",
        "viewCount": 2678,
        "code": "SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);",
        "md": "# 子查询\n\n子查询是在另一个查询内部的查询，可以用于更灵活的数据查询和操作。\n\n## 子查询作为条件\n子查询可以用于`WHERE`子句中，作为条件的一部分：\n```sql\nSELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);\n```\n\n## 子查询作为数据源\n子查询可以用于`FROM`子句中，作为数据源：\n```sql\nSELECT * FROM (SELECT * FROM employees WHERE department_id = 1) AS subquery;\n```\n\n## 子查询作为表达式\n子查询可以用于`SELECT`子句中，作为表达式的一部分：\n```sql\nSELECT name, (SELECT COUNT(*) FROM orders WHERE employees.id = orders.employee_id) AS order_count FROM employees;\n```\n\n## 子查询的类型\n- **单行子查询**：子查询返回单个值。\n- **多行子查询**：子查询返回多行单列的值。\n- **多列子查询**：子查询返回多行多列的值。\n\n## 应用场景\n- **复杂查询**：当查询条件复杂，无法用简单的连接查询实现时，可以使用子查询。\n- **数据比较**：将表中的数据与子查询的结果进行比较，例如大于、小于、等于等。\n- **数据汇总**：在查询中嵌套汇总数据，例如计算某个指标的平均值、总和等。",
        "tags": ["子查询", "SQL", "灵活查询"]
      },
      {
        "id": 46,
        "categoryId": "mysql",
        "title": "如何使用MySQL的索引优化查询？",
        "difficulty": "中等",
        "viewCount": 2890,
        "code": "CREATE INDEX idx_column ON table (column);",
        "md": "# 索引优化查询\n\n索引是数据库中用于提高查询速度的数据结构，通过在表的列上创建索引，可以加快查询操作的执行速度。\n\n## 创建索引\n使用`CREATE INDEX`语句可以创建索引：\n```sql\nCREATE INDEX idx_column ON table (column);\n```\n\n## 删除索引\n使用`DROP INDEX`语句可以删除索引：\n```sql\nDROP INDEX idx_column ON table;\n```\n\n## 索引类型\n- **单列索引**：在单个列上创建索引。\n- **复合索引**：在多个列上创建索引，查询时会按照索引列的顺序进行匹配。\n- **唯一索引**：索引列的值必须唯一，可以用于保证数据的唯一性。\n- **全文索引**：用于全文检索，可以快速查找文本中的关键词。\n\n## 索引的使用场景\n- **频繁查询的列**：在经常用于查询条件的列上创建索引，例如`WHERE`子句中的列。\n- **连接查询的列**：在连接查询中用于连接条件的列上创建索引，可以加快连接速度。\n- **排序和分组的列**：在`ORDER BY`和`GROUP BY`子句中使用的列上创建索引，可以优化排序和分组操作。\n\n## 索引的缺点\n- **增加存储空间**：索引需要额外的存储空间，特别是对于大型表。\n- **影响插入、更新和删除性能**：在插入、更新和删除数据时，需要同时维护索引，会增加操作的时间。\n- **过度索引**：过多的索引会导致维护成本增加，可能反而降低性能。",
        "tags": ["索引", "性能优化", "SQL"]
      },
      {
        "id": 47,
        "categoryId": "mysql",
        "title": "如何使用MySQL的分区表？",
        "difficulty": "中等",
        "viewCount": 2456,
        "code": "CREATE TABLE table (id INT, date DATE) PARTITION BY RANGE (YEAR(date)) (PARTITION p0 VALUES LESS THAN (2020), PARTITION p1 VALUES LESS THAN (2025));",
        "md": "# 分区表\n\n分区表是将一个大的表按照某种规则划分为多个小的分区，每个分区可以独立管理，提高查询性能和管理效率。\n\n## 按范围分区\n按照某个列的值范围进行分区：\n```sql\nCREATE TABLE table (id INT, date DATE)\nPARTITION BY RANGE (YEAR(date)) (\n  PARTITION p0 VALUES LESS THAN (2020),\n  PARTITION p1 VALUES LESS THAN (2025)\n);\n```\n\n## 按列表分区\n按照某个列的值列表进行分区：\n```sql\nCREATE TABLE table (id INT, type VARCHAR(10))\nPARTITION BY LIST (type) (\n  PARTITION p0 VALUES IN ('type1', 'type2'),\n  PARTITION p1 VALUES IN ('type3', 'type4')\n);\n```\n\n## 按哈希分区\n按照某个列的哈希值进行分区：\n```sql\nCREATE TABLE table (id INT)\nPARTITION BY HASH (id)\nPARTITIONS 4;\n```\n\n## 分区的优点\n- **提高查询性能**：查询时只需要扫描相关的分区，减少数据扫描量。\n- **简化管理**：可以对单个分区进行维护操作，例如备份、清理等。\n- **数据分布**：可以将数据分布在不同的存储设备上，提高存储效率。\n\n## 分区的适用场景\n- **大数据量表**：当表的数据量非常大时，分区可以提高管理和查询效率。\n- **数据生命周期管理**：可以按照时间或其他规则对数据进行分区，方便数据的归档和删除。\n- **性能优化**：对于频繁按照某个列进行查询的表，分区可以提高查询性能。",
        "tags": ["分区表", "性能优化", "SQL"]
      },
      {
        "id": 48,
        "categoryId": "mysql",
        "title": "如何使用MySQL的全文检索？",
        "difficulty": "中等",
        "viewCount": 2345,
        "code": "SELECT * FROM articles WHERE MATCH(content) AGAINST('keyword');",
        "md": "# 全文检索\n\n全文检索用于在文本数据中快速查找关键词，适用于大量的文本数据搜索。\n\n## 创建全文索引\n在需要进行全文检索的列上创建全文索引：\n```sql\nCREATE FULLTEXT INDEX idx_content ON articles (content);\n```\n\n## 使用全文检索\n使用`MATCH ... AGAINST`语法进行全文检索：\n```sql\nSELECT * FROM articles WHERE MATCH(content) AGAINST('keyword');\n```\n\n## 检索模式\n- **自然语言模式**：默认模式，根据关键词的相关性返回结果。\n- **布尔模式**：支持更复杂的查询语法，例如加号表示必须包含，减号表示必须不包含。\n\n## 示例（布尔模式）\n搜索包含'keyword1'但不包含'keyword2'的文章：\n```sql\nSELECT * FROM articles WHERE MATCH(content) AGAINST('+keyword1 -keyword2' IN BOOLEAN MODE);\n```\n\n## 全文检索的优点\n- **高效搜索**：可以快速在大量文本数据中查找关键词，比LIKE操作符更高效。\n- **相关性排序**：根据关键词的相关性对结果进行排序，返回最匹配的结果。\n- **支持复杂查询**：布尔模式支持复杂的查询语法，可以满足多种搜索需求。\n\n## 应用场景\n- **搜索引擎**：在网站或应用中实现搜索功能，快速查找文章、产品等。\n- **数据分析**：在大量的文本数据中查找特定信息，例如日志分析、社交媒体数据挖掘等。\n- **内容管理系统**：在内容管理系统中，快速检索文章、页面等。",
        "tags": ["全文检索", "文本搜索", "SQL"]
      },
      {
        "id": 49,
        "categoryId": "mysql",
        "title": "如何使用MySQL的事件调度器？",
        "difficulty": "中等",
        "viewCount": 2123,
        "code": "CREATE EVENT event_name ON SCHEDULE EVERY 1 DAY DO BEGIN ... END;",
        "md": "# 事件调度器\n\n事件调度器可以按照预定的时间间隔或特定时间执行SQL代码，用于实现定时任务。\n\n## 创建事件\n使用`CREATE EVENT`语句可以创建事件：\n```sql\nCREATE EVENT event_name\nON SCHEDULE EVERY 1 DAY\nDO\nBEGIN\n  -- SQL语句\nEND;\n```\n\n## 启用事件调度器\n默认情况下，事件调度器是禁用的，需要通过以下命令启用：\n```sql\nSET GLOBAL event_scheduler = ON;\n```\n\n## 示例\n每天凌晨2点清理日志表：\n```sql\nCREATE EVENT clean_logs\nON SCHEDULE AT EVERY 1 DAY STARTS '2024-01-01 02:00:00'\nDO\nBEGIN\n  DELETE FROM logs WHERE log_time < DATE_SUB(NOW(), INTERVAL 7 DAY);\nEND;\n```\n\n## 事件调度器的优点\n- **自动化**：可以自动执行定时任务，无需人工干预。\n- **灵活性**：可以设置复杂的调度计划，例如每天、每周、每月或特定时间执行。\n- **可靠性**：即使应用程序崩溃或重启，事件调度器仍然可以按照计划执行任务。\n\n## 应用场景\n- **数据备份**：定期备份数据库，确保数据安全。\n- **数据清理**：定期清理过期数据，释放存储空间。\n- **统计分析**：定期生成统计报表，为决策提供支持。",
        "tags": ["事件调度器", "定时任务", "SQL"]
      },
      {
        "id": 50,
        "categoryId": "mysql",
        "title": "如何使用MySQL的事务隔离级别？",
        "difficulty": "中等",
        "viewCount": 2456,
        "code": "SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;",
        "md": "# 事务隔离级别\n\n事务隔离级别决定了在一个事务中能够看到其他事务所做的更改的程度，不同的隔离级别会引发不同的并发问题。\n\n## 隔离级别\n- **读未提交(READ UNCOMMITTED)**：最低的隔离级别，允许脏读，即一个事务可以读取另一个事务未提交的数据。\n- **读已提交(READ COMMITTED)**：一个事务只能读取另一个事务已经提交的数据，避免脏读，但可能出现不可重复读和幻读。\n- **可重复读(REPEATABLE READ)**：在同一个事务中，多次读取相同的数据集时，结果一致，避免不可重复读，但可能出现幻读。\n- **串行化(SERIALIZABLE)**：最高的隔离级别，完全隔离各个事务，避免脏读、不可重复读和幻读，但性能较低。\n\n## 设置隔离级别\n可以为会话或全局设置隔离级别：\n```sql\n-- 会话级别\nSET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;\n\n-- 全局级别\nSET GLOBAL TRANSACTION ISOLATION LEVEL READ COMMITTED;\n```\n\n## 隔离级别与并发问题\n| 隔离级别       | 脏读 | 不可重复读 | 幻读 |\n|----------------|------|------------|------|\n| READ UNCOMMITTED | ✔️   | ✔️         | ✔️   |\n| READ COMMITTED   | ✖️   | ✔️         | ✔️   |\n| REPEATABLE READ  | ✖️   | ✖️         | ✔️   |\n| SERIALIZABLE     | ✖️   | ✖️         | ✖️   |\n\n## 应用场景\n- **金融系统**：通常使用串行化隔离级别，确保数据的绝对一致性。\n- **电商系统**：可重复读隔离级别可以满足大部分需求，既能保证数据一致性，又能保持较好的性能。\n- **数据分析**：读已提交隔离级别可以避免脏读，同时允许其他事务的提交数据被读取，提高查询效率。",
        "tags": ["事务", "隔离级别", "并发控制"]
      },
      {
        "id": 51,
        "categoryId": "mysql",
        "title": "如何保证在高并发情况下安全地修改同一行数据？",
        "difficulty": "困难",
        "viewCount": 2123,
        "code": "UPDATE accounts SET balance = balance - 100 WHERE user_id = 1 AND balance >= 100;",
        "md": "# 高并发下的数据安全性\n\n在高并发情况下，多个事务可能同时修改同一行数据，导致数据不一致或错误。为了保证数据的安全性，可以采用以下方法：\n\n## 乐观锁\n乐观锁假设在大多数情况下不会发生冲突，通过版本号或时间戳来检测冲突。\n\n### 实现方式\n在表中添加一个版本号列，在更新时检查版本号是否匹配：\n```sql\nUPDATE table SET column = value, version = version + 1 WHERE id = 1 AND version = current_version;\n```\n\n## 悲观锁\n悲观锁假设冲突经常发生，通过锁机制来防止多个事务同时修改同一行数据。\n\n### 实现方式\n使用`SELECT ... FOR UPDATE`锁定行：\n```sql\nSTART TRANSACTION;\nSELECT * FROM table WHERE id = 1 FOR UPDATE;\n-- 进行业务逻辑处理\nUPDATE table SET column = value WHERE id = 1;\nCOMMIT;\n```\n\n## 示例场景\n假设有一个银行转账系统，在高并发情况下，需要保证账户余额的正确性：\n```sql\nSTART TRANSACTION;\nSELECT balance FROM accounts WHERE user_id = 1 FOR UPDATE;\n-- 检查余额是否足够\nUPDATE accounts SET balance = balance - 100 WHERE user_id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE user_id = 2;\nCOMMIT;\n```\n\n## 注意事项\n- **锁的粒度**：尽量使用行级锁而不是表级锁，减少锁的范围，提高并发性能。\n- **事务时间**：尽量缩短事务的执行时间，减少锁的持有时间，避免死锁。\n- **死锁处理**：在高并发情况下，死锁是不可避免的，需要在应用程序中处理死锁情况，例如重试机制。",
        "tags": ["高并发", "锁", "事务"]
    },
    {
        "id": 52,
        "categoryId": "mysql",
        "title": "如何处理和优化大型UPDATE操作？",
        "difficulty": "困难",
        "viewCount": 2345,
        "code": "UPDATE table SET column = value WHERE condition;",
        "md": "# 大型UPDATE操作的处理与优化\n\n在处理大型UPDATE操作时，可能会遇到性能问题、锁表问题等。以下是一些优化方法：\n\n## 分批更新\n将大型UPDATE操作分成多个小批量操作，减少锁表时间和事务大小：\n```sql\n-- 每次更新1000条记录\nWHILE true DO\n  UPDATE table SET column = value WHERE condition LIMIT 1000;\n  -- 检查是否还有需要更新的记录\n  SELECT COUNT(*) INTO @count FROM table WHERE condition;\n  IF @count = 0 THEN\n    LEAVE WHILE;\n  END IF;\nEND WHILE;\n```\n\n## 使用临时表\n将需要更新的记录先筛选到临时表中，然后进行批量更新：\n```sql\nCREATE TEMPORARY TABLE temp_table AS SELECT id FROM table WHERE condition;\nUPDATE table JOIN temp_table ON table.id = temp_table.id SET table.column = value;\nDROP TEMPORARY TABLE temp_table;\n```\n\n## 优化索引\n确保WHERE子句中的列有适当的索引，加快条件筛选速度：\n```sql\nCREATE INDEX idx_condition ON table (condition_column);\n```\n\n## 调整事务隔离级别\n根据实际需求调整事务隔离级别，减少锁的冲突：\n```sql\nSET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;\n```\n\n## 注意事项\n- **监控性能**：在执行大型UPDATE操作时，监控数据库的性能指标，如CPU使用率、磁盘I/O等。\n- **备份数据**：在进行大型数据更新前，确保有完整的数据备份，以便在出现问题时可以恢复。\n- **测试环境**：在生产环境执行大型UPDATE操作前，先在测试环境中验证操作的正确性和性能。",
        "tags": ["UPDATE", "性能优化", "高并发"]
      }
    ],
    javabasics: [
      {
        "id": 1,
        "categoryId": "javabasics",
        "title": "Java的基本特性是什么？",
        "difficulty": "简单",
        "viewCount": 1567,
        "code": "",
        "md": "# Java的基本特性\n\nJava具有以下基本特性：\n- **简单性**：语法简单，去掉了C++中一些复杂的特性，如指针、结构体等。\n- **面向对象**：支持封装、继承、多态等面向对象特性。\n- **平台无关性**：通过JVM实现一次编写，到处运行。\n- **健壮性**：具有强大的异常处理机制和内存管理。\n- **安全性**：防止恶意代码的攻击，如类的加载和验证机制。\n- **多线程**：支持多线程编程，可以充分利用多核处理器的优势。\n- **动态性**：支持动态加载类和方法，具有反射机制。",
        "tags": ["Java特性", "基础特性", "面向对象"]
      },
      {
        "id": 2,
        "categoryId": "javabasics",
        "title": "解释Java中的四种访问修饰符。",
        "difficulty": "简单",
        "viewCount": 1452,
        "code": "",
        "md": "# Java中的四种访问修饰符\n\nJava中的四种访问修饰符包括：\n1. **default（默认）**：在同一包内可见，不使用任何关键字。\n2. **private**：仅在类内部可见，通常用于修饰字段和方法，防止外部直接访问。\n3. **protected**：在同一包内或不同包的子类中可见，常用于继承场景。\n4. **public**：在任何地方都可见，通常用于类、接口和方法，使其具有最高的访问权限。",
        "tags": ["访问修饰符", "封装", "权限控制"]
      },
      {
        "id": 3,
        "categoryId": "javabasics",
        "title": "描述Java的垃圾回收机制。",
        "difficulty": "中等",
        "viewCount": 1789,
        "code": "",
        "md": "# Java的垃圾回收机制\n\nJava的垃圾回收（Garbage Collection，GC）机制用于自动管理内存，回收不再使用的对象所占用的内存空间。其主要过程包括：\n1. **标记阶段**：确定哪些对象是不再被引用的。\n2. **回收阶段**：回收这些被标记对象的内存空间。\n\n常见的垃圾回收算法有引用计数法、标记-清除算法、复制算法、标记-整理算法等。JVM中常用的垃圾回收器有Serial、ParNew、Parallel、CMS、G1等，不同的回收器适用于不同的场景和需求。",
        "tags": ["垃圾回收", "内存管理", "JVM"]
      },
      {
        "id": 4,
        "categoryId": "javabasics",
        "title": "什么是Java的异常处理？",
        "difficulty": "中等",
        "viewCount": 1632,
        "code": "",
        "md": "# Java的异常处理\n\nJava的异常处理机制用于处理程序运行过程中可能出现的错误或异常情况，使程序能够优雅地处理错误并继续执行。异常处理主要包括以下概念：\n- ** Throwable**：所有异常类的父类。\n- **Exception**：表示程序中出现的异常情况，可分为运行时异常（RuntimeException）和检查型异常（非运行时异常）。\n- **Error**：表示严重的错误，通常无法恢复，如虚拟机错误。\n\n异常处理的常用语句包括try、catch、finally、throw和throws。通过try块包裹可能产生异常的代码，catch块捕获并处理异常，finally块用于执行无论是否发生异常都要执行的代码，如资源关闭操作。",
        "tags": ["异常处理", "错误处理", "程序健壮性"]
      },
      {
        "id": 5,
        "categoryId": "javabasics",
        "title": "如何在Java中创建线程？",
        "difficulty": "中等",
        "viewCount": 1890,
        "code": "public class MyThread extends Thread {\n    @Override\n    public void run() {\n        // 线程执行的代码\n    }\n}\n\npublic class MyRunnable implements Runnable {\n    @Override\n    public void run() {\n        // 线程执行的代码\n    }\n}\n\n// 创建线程的两种方式\nThread thread1 = new MyThread();\nthread1.start();\n\nThread thread2 = new Thread(new MyRunnable());\nthread2.start();",
        "md": "# 创建Java线程的方式\n\n在Java中，创建线程主要有两种方式：\n1. **继承Thread类**：创建一个继承自Thread的类，重写run()方法，在其中定义线程执行的代码，然后通过创建该类的实例并调用start()方法启动线程。\n2. **实现Runnable接口**：创建一个实现Runnable接口的类，重写run()方法，定义线程执行的代码，然后通过将该类的实例作为参数传递给Thread的构造函数创建线程，并调用start()方法启动线程。\n\n这两种方式各有优缺点，继承Thread类的方式简单直接，但因为Java不支持多继承，所以一个类不能同时继承其他类；实现Runnable接口的方式更灵活，允许多个线程共享同一个对象，适用于需要同时继承其他类的情况。",
        "tags": ["多线程", "线程创建", "并发编程"]
      },
      {
        "id": 6,
        "categoryId": "javabasics",
        "title": "解释Java的集合框架。",
        "difficulty": "中等",
        "viewCount": 1765,
        "code": "",
        "md": "# Java的集合框架\n\nJava的集合框架提供了一系列用于存储和操作对象的类和接口，主要包括以下部分：\n- **Collection接口**：表示一组对象的集合，包括List、Set和Queue等子接口。\n  - **List接口**：有序集合，允许重复元素，如ArrayList、LinkedList、Vector等。\n  - **Set接口**：不允许重复元素的集合，如HashSet、TreeSet等。\n  - **Queue接口**：用于存储队列数据结构，如LinkedList、PriorityQueue等。\n- **Map接口**：表示键值对的集合，如HashMap、TreeMap、Hashtable等。\n\n集合框架的优点包括：\n- **统一性**：提供了一致的接口和操作方式，便于使用和扩展。\n- **高效性**：针对不同的数据结构和操作需求，提供了优化的实现类。\n- **灵活性**：可以通过组合和继承等方式，根据具体需求选择合适的集合类。",
        "tags": ["集合框架", "数据结构", "存储管理"]
      },
      {
        "id": 7,
        "categoryId": "javabasics",
        "title": "什么是Java泛型？",
        "difficulty": "中等",
        "viewCount": 1678,
        "code": "",
        "md": "# Java泛型\n\nJava泛型（Generics）是在JDK 5中引入的一种特性，用于在编译时提供类型检查和类型安全，避免类型转换的错误。泛型的主要作用包括：\n- **类型安全**：在编译时检查类型是否匹配，减少运行时的ClassCastException异常。\n- **代码复用**：通过使用泛型，可以编写通用的类和方法，适用于多种数据类型，提高代码的复用性和可维护性。\n- **消除强制类型转换**：在使用集合等数据结构时，避免显式的类型转换，提高代码的可读性和安全性。\n\n泛型的使用方式包括在类、接口和方法中指定类型参数，如`List<String>`表示一个存储字符串的列表。",
        "tags": ["泛型", "类型安全", "代码复用"]
      },
      {
        "id": 8,
        "categoryId": "javabasics",
        "title": "解释静态变量和静态方法。",
        "difficulty": "简单",
        "viewCount": 1432,
        "code": "",
        "md": "# 静态变量和静态方法\n\n在Java中，静态变量和静态方法属于类本身，而不是类的某个对象。\n- **静态变量**：使用static关键字修饰的变量，属于类的共享内存，所有对象共享同一份静态变量。静态变量在类加载时初始化，内存分配在方法区。\n- **静态方法**：使用static关键字修饰的方法，只能访问静态变量和静态方法，不能访问非静态变量和方法。静态方法在类加载时进入方法区，可以通过类名直接调用，无需创建对象。\n\n静态变量和静态方法的优点包括：\n- **节省内存**：静态变量和静态方法在内存中只有一份，多个对象共享，节省内存空间。\n- **方便调用**：静态方法可以通过类名直接调用，无需创建对象，简化代码。",
        "tags": ["静态变量", "静态方法", "类成员"]
      },
      {
        "id": 9,
        "categoryId": "javabasics",
        "title": "final、finally和finalize的区别是什么？",
        "difficulty": "中等",
        "viewCount": 1987,
        "code": "",
        "md": "# final、finally和finalize的区别\n\n1. **final**：\n   - 是Java中的一个关键字，用于修饰类、方法和变量。\n   - 修饰类表示该类不能被继承。\n   - 修饰方法表示该方法不能被子类重写。\n   - 修饰变量表示该变量是常量，一旦赋值不能改变。\n\n2. **finally**：\n   - 是用于异常处理的一个关键字，通常与try和catch一起使用。\n   - finally块中的代码无论是否发生异常都会执行，常用于释放资源等操作，保证程序的健壮性。\n\n3. **finalize()**：\n   - 是Object类中的一个方法，用于定义对象被垃圾回收前的清理操作。\n   - 当垃圾回收器确定一个对象没有被引用且需要回收时，会调用该对象的finalize()方法。\n   - 不建议依赖finalize()进行资源释放，因为其调用时间不确定且性能较低，应尽量在程序中主动管理资源释放。",
        "tags": ["关键字", "异常处理", "垃圾回收"]
      },
      {
        "id": 10,
        "categoryId": "javabasics",
        "title": "什么是Java的序列化？",
        "difficulty": "中等",
        "viewCount": 1543,
        "code": "",
        "md": "# Java的序列化\n\nJava的序列化（Serialization）是指将对象的状态信息转换为可以存储或传输的形式的过程。序列化的主要作用包括：\n- **对象持久化**：将对象保存到文件或数据库中，以便后续恢复使用。\n- **网络传输**：通过网络将对象从一个地址传输到另一个地址，如RMI、Socket通信等。\n\n要实现序列化，一个类需要实现Serializable接口，该接口是一个标记接口，没有需要实现的方法。序列化的过程是通过ObjectOutputStream将对象写入输出流，反序列化则是通过ObjectInputStream从输入流中读取对象。需要注意的是，静态变量和用transient修饰的变量不会被序列化。",
        "tags": ["序列化", "对象存储", "网络传输"]
      },
      {
        "id": 11,
        "categoryId": "javabasics",
        "title": "什么是反射？",
        "difficulty": "中等",
        "viewCount": 1654,
        "code": "",
        "md": "# Java反射\n\n反射（Reflection）是Java提供的一种强大的机制，允许程序在运行时访问、检测和修改它本身的类、方法、字段等信息。反射的主要功能包括：\n- **获取类的信息**：通过Class类获取类的名称、修饰符、字段、方法等。\n- **创建对象**：通过Class的newInstance()方法或构造器的newInstance()方法创建对象。\n- **访问和修改字段**：通过Field类获取字段的值并进行修改，即使该字段是私有的。\n- **调用方法**：通过Method类调用对象的方法，包括私有方法。\n\n反射的使用场景包括框架开发、动态加载类、实现通用的数据访问层等。然而，反射的使用也存在性能开销大、破坏封装性、代码可读性差等缺点，应谨慎使用。",
        "tags": ["反射", "运行时信息", "动态操作"]
      },
      {
        "id": 12,
        "categoryId": "javabasics",
        "title": "解释JDBC和JPA的区别。",
        "difficulty": "中等",
        "viewCount": 1765,
        "code": "",
        "md": "# JDBC和JPA的区别\n\n1. **JDBC（Java Database Connectivity）**：\n   - 是Java中用于执行SQL语句的API，提供了与数据库连接和交互的底层操作。\n   - 直接使用SQL语句进行数据库操作，需要手动处理连接、语句、结果集等资源。\n   - 对数据库的依赖性较高，不同数据库的SQL语法和驱动可能不同，代码的可移植性较差。\n\n2. **JPA（Java Persistence API）**：\n   - 是一种ORM（对象关系映射）规范，提供了一套高层次的API用于对象与关系数据库之间的映射和操作。\n   - 使用面向对象的方式操作数据库，通过实体类与数据库表的映射，简化了数据库操作的代码。\n   - 提供了更丰富的查询方式，如JPQL（Java Persistence Query Language），支持面向对象的查询语言。\n   - 实现了数据访问层的统一规范，便于在不同ORM框架（如Hibernate、EclipseLink等）之间切换，提高了代码的可移植性和可维护性。\n\n总结来说，JDBC更接近底层的数据库操作，适合对SQL语句有深入了解的场景；JPA则提供了更高层次的抽象和便利性，适合快速开发和维护复杂的业务逻辑。",
        "tags": ["数据库", "ORM", "数据访问"]
      },
      {
        "id": 13,
        "categoryId": "javabasics",
        "title": "什么是Spring框架？",
        "difficulty": "中等",
        "viewCount": 2012,
        "code": "",
        "md": "# Spring框架\n\nSpring框架是一个开源的Java EE框架，旨在简化企业级应用的开发。其核心特性包括：\n- **控制反转（IoC）**：通过容器管理对象的创建和依赖关系，将对象的创建和依赖注入交给Spring容器，降低了组件之间的耦合度。\n- **面向切面编程（AOP）**：提供了一种横向模块化的编程方式，用于处理系统中分散的横切关注点（如日志、事务、安全等），提高了代码的复用性和可维护性。\n- **丰富的模块**：包括Spring MVC、Spring Data、Spring Security、Spring Boot等，覆盖了Web开发、数据访问、安全控制、微服务架构等多个领域。\n\nSpring框架的优势在于其轻量级、非侵入式、松散耦合等特性，使得开发者能够更专注于业务逻辑的实现，而不必过多关注底层的基础设施代码。",
        "tags": ["Spring", "框架", "IoC", "AOP"]
      },
      {
        "id": 14,
        "categoryId": "javabasics",
        "title": "JDK和JRE有什么区别？",
        "difficulty": "简单",
        "viewCount": 1345,
        "code": "",
        "md": "# JDK和JRE的区别\n\n1. **JDK（Java Development Kit）**：\n   - 是Java开发工具包，包含了Java运行时环境（JRE）和编译器（javac）、调试器（jdb）、文档生成工具（javadoc）等开发工具。\n   - 用于开发Java应用程序，提供了完整的Java开发环境。\n\n2. **JRE（Java Runtime Environment）**：\n   - 是Java运行时环境，包含了Java虚拟机（JVM）、Java类库等运行Java程序所需的核心组件。\n   - 用于运行Java应用程序，不包含开发工具，适合只运行Java程序的用户。\n\n简而言之，JDK是用于开发Java程序的完整工具包，而JRE是用于运行Java程序的最小环境。如果只需要运行Java程序，安装JRE即可；如果需要开发Java程序，则需要安装JDK。",
        "tags": ["JDK", "JRE", "运行环境", "开发工具"]
      },
      {
        "id": 15,
        "categoryId": "javabasics",
        "title": "==和equals的区别是什么？",
        "difficulty": "简单",
        "viewCount": 1980,
        "code": "",
        "md": "# ==和equals的区别\n\n1. **==运算符**：\n   - 用于比较两个变量的值是否相等。\n   - 对于基本数据类型，比较的是它们的值。\n   - 对于引用数据类型，比较的是它们在内存中的地址，即是否指向同一个对象。\n\n2. **equals方法**：\n   - 是Object类中的一个方法，用于比较两个对象的内容是否相等。\n   - 默认情况下，equals方法的行为与==相同，即比较对象的内存地址。\n   - 但在很多类（如String、Integer等）中，equals方法被重写，用于比较对象的实际内容。例如，String类的equals方法比较的是字符串的字符序列是否相同。\n\n因此，在比较对象的内容时，应使用equals方法；而在比较对象的引用是否相同或基本数据类型的值是否相等时，使用==运算符。",
        "tags": ["比较运算", "对象比较", "方法重写"]
      },
      {
        "id": 16,
        "categoryId": "javabasics",
        "title": "两个对象的hashCode()相同，则equals()也一定为true，对吗？",
        "difficulty": "中等",
        "viewCount": 1756,
        "code": "",
        "md": "# hashCode和equals的关系\n\n根据Java规范，如果两个对象的equals方法返回true，那么它们的hashCode方法必须返回相同的值。但反过来，如果两个对象的hashCode方法返回相同的值，并不意味着它们的equals方法一定返回true。因为hashCode的返回值只是对象的一个散列值，不同的对象可能具有相同的散列值（散列冲突）。因此，hashCode相同只是equals可能为true的必要条件，而不是充分条件。在实际使用中，应确保equals和hashCode方法的一致性，即equals方法返回true时，hashCode也必须相同；而hashCode相同时，equals不一定为true。",
        "tags": ["hashCode", "equals", "对象比较"]
      },
      {
        "id": 17,
        "categoryId": "javabasics",
        "title": "final在Java中有什么作用？",
        "difficulty": "简单",
        "viewCount": 1489,
        "code": "",
        "md": "# final的作用\n\nfinal是Java中的一个关键字，用于表示不可改变性，可以在类、方法和变量上使用：\n- **修饰类**：表示该类不能被继承，即不能有子类。\n- **修饰方法**：表示该方法不能被子类重写。\n- **修饰变量**：表示该变量是常量，一旦赋值后不能被修改。对于基本类型，final变量的值不能改变；对于引用类型，final变量的引用地址不能改变，但对象内部的状态可以改变。\n\n使用final的主要目的是确保数据的安全性和一致性，防止意外的修改或覆盖。",
        "tags": ["final", "关键字", "常量"]
      },
      {
        "id": 18,
        "categoryId": "javabasics",
        "title": "Java中的Math.round(-1.5)等于多少？",
        "difficulty": "简单",
        "viewCount": 1324,
        "code": "System.out.println(Math.round(-1.5)); // 输出-1",
        "md": "# Math.round(-1.5)的结果\n\nMath.round()方法用于对浮点数进行四舍五入操作，返回最接近的整数。对于-1.5，根据Java的四舍五入规则，小数部分为0.5时，会向远离零的方向取整。因此，Math.round(-1.5)的结果是-1，而不是-2。这是因为-1.5四舍五入后更接近于-1，而不是-2。",
        "tags": ["Math.round", "四舍五入", "浮点数"]
      },
      {
        "id": 19,
        "categoryId": "javabasics",
        "title": "String属于基础的数据类型吗？",
        "difficulty": "简单",
        "viewCount": 1287,
        "code": "",
        "md": "# String是否属于基础数据类型\n\n在Java中，String不是基础数据类型，而是一个类，属于引用数据类型。Java的基础数据类型包括byte、short、int、long、float、double、char和boolean。String是java.lang包下的一个类，用于表示文本内容。虽然String在使用上具有一些特殊性（如字符串字面量、不可变性等），但它本质上是一个对象，而不是基础数据类型。",
        "tags": ["String", "数据类型", "引用类型"]
      },
      {
        "id": 20,
        "categoryId": "javabasics",
        "title": "Java中操作字符串都有哪些类？它们之间有什么区别？",
        "difficulty": "中等",
        "viewCount": 1563,
        "code": "",
        "md": "# Java中的字符串类及其区别\n\nJava中用于操作字符串的类主要有String、StringBuilder和StringBuffer，它们之间的区别如下：\n\n1. **String**：\n   - 表示不可变的字符序列。\n   - 一旦创建，其值不能被修改。\n   - 多线程安全，因为不可变性使得多个线程可以安全地访问它。\n   - 性能较低，因为每次操作都会生成新的字符串对象。\n\n2. **StringBuffer**：\n   - 表示可变的字符序列，并且是线程安全的。\n   - 提供了append、insert、reverse等方法，可以高效地修改字符串内容。\n   - 内部通过同步机制保证线程安全，因此性能相对较低。\n\n3. **StringBuilder**：\n   - 表示可变的字符序列，但不是线程安全的。\n   - 提供了与StringBuffer类似的方法，但由于没有线程安全机制，性能更高。\n   - 适用于单线程环境下的字符串拼接和修改操作。\n\n总结来说，如果需要操作大量的字符串并且希望提高性能，单线程环境下应优先使用StringBuilder；如果需要线程安全，则使用StringBuffer；如果字符串内容不需要修改，则使用String。",
        "tags": ["字符串", "String", "StringBuilder", "StringBuffer"]
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
    ],
    golang: [],
  }
}
