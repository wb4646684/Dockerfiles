/usr/local/etcd/etcd \
  --name=${HOSTNAME} \
  --initial-advertise-peer-urls=http://0.0.0.0:2380 \
  --listen-peer-urls=http://0.0.0.0:2380 \
  --listen-client-urls=http://0.0.0.0:2379 \
  --advertise-client-urls=http://0.0.0.0:2379 \
  --initial-cluster-token=41c1fcdb0e8db3975f6ce66e48f32 \
  --initial-cluster=${HOSTNAME}=http://0.0.0.0:2380 \
  --initial-cluster-state=new \
  --data-dir=/data/etcd
