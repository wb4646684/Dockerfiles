FROM ccr.ccs.tencentyun.com/wb4646684/centos:7.6.1810
ADD ./etcd-v3.3.17-linux-amd64 /usr/local/etcd
ADD ./entrypoint.sh /
VOLUME /data/etcd
EXPOSE 2379
ENTRYPOINT sh /entrypoint.sh
