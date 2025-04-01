# 车辆信息查询系统（离线版）

这是一个基于Bootstrap和FastAPI的车辆信息查询系统，支持离线部署。

## 部署说明

### 1. 下载必要文件

1. 创建`lib`目录
2. 下载以下文件并放入`lib`目录：
   - Bootstrap CSS: https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.2.3/css/bootstrap.min.css
   - Bootstrap JS: https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.2.3/js/bootstrap.bundle.min.js

### 2. 文件结构

确保您的文件结构如下：
```
QueryDjzsbhFrontend/
├── index.html
├── app.js
├── README.md
└── lib/
    ├── bootstrap.min.css
    └── bootstrap.bundle.min.js
```

### 3. 部署步骤

1. 将所有文件复制到Web服务器目录
2. 确保文件权限正确设置
3. 通过Web服务器访问index.html

### 4. 注意事项

- 确保所有文件都在同一目录层级
- 不要修改文件名和目录结构
- 如果使用本地文件系统直接打开，某些浏览器可能会因为安全限制而阻止JavaScript执行
- 建议使用Web服务器（如Apache、Nginx等）部署

## 技术栈

- 前端：HTML5 + CSS3 + JavaScript + Bootstrap 5.2.3
- 后端：Python + FastAPI + Pandas
- 开发工具：Cursor

## 使用说明

1. 打开index.html
2. 点击"下载模板"获取Excel模板
3. 填写模板中的车牌号和车辆类型信息
4. 选择填写好的Excel文件
5. 点击"查询"按钮开始处理
6. 等待处理完成后下载结果

## 版权信息

©2024-2025|此网站仅授权车务科特定人员使用|如遇故障请联系3079|该网站原作者保留所有权利 