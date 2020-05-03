# 数据持久化方法的一个封装
为什么要封装: 因为很多地方都会用到这个东西

# 与localStorage的区别?
localStorage不能跨越浏览器

# 目前有哪些值?

- allTarget  

定义: 所有大目标
格式: [{ id, name }]

- processTask  

定义: 正在执行中的任务
格式: { id, ... }

- draftPlanDesign  

定义: 目标计划草稿
格式: { program }


- todoTaskTemplate  

定义: 目标计划草稿
格式: [{ title, content, measure, span, aspects, worth, estimate }]
