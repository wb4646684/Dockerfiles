FROM ccr.ccs.tencentyun.com/wb4646684/centos:7.6.1810

# 设置JIRA_HOME环境变量，否则无法正常启动
ENV JIRA_HOME /data/jira

ADD ./atlassian-jira-software-8.4.1-standalone /usr/local/jira

# 增加MySQL5.7驱动
ADD ./mysql-connector-java-5.1.48/mysql-connector-java-5.1.48-bin.jar /usr/local/jira/lib/

WORKDIR /usr/local/jira

RUN mkdir -p /data/jira

# 安装Runtime
RUN yum install -y java \
       && rm -rf /var/cache/yum/

# 数据目录
VOLUME /data/jira

# HTTP服务端口
EXPOSE 8080

# "-fg"参数为前台启动，否则容器会启动失败
ENTRYPOINT ["bin/start-jira.sh", "-fg"]
