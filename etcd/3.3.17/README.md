## 镜像说明
```
基于centos:7.6.1810构建etcd服务(默认启动为单节点)
```

## 使用说明
```
1.直接启动即为单节点etcd，如需启动集群版本可重新挂载/entrypoint.sh文件
2.应用目录/usr/local/etcd/
3.数据目录/data/etcd/
```

## 构建镜像
```
docker build -t ccr.ccs.tencentyun.com/wb4646684/etcd:3.3.17 .
```


