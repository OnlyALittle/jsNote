## Docker

### 常见命令
- 从 Docker 镜像仓库获取镜像的命令是 docker pull。其命令格式为：
  - docker pull [选项] [Docker Registry 地址[:端口号]/]仓库名[:标签]  
  - docker pull centos

- 运行镜像
	- docker run -it --rm -d centos bash
	- -it：这是两个参数，一个是 -i：交互式操作，一个是 -t 终端。
	- 我们这里打算进入 bash 执行一些命令并查看返回结果，因 此我们需要交互式终端。
	- --rm：这个参数是说容器退出后随之将其删除。默认情况下，为了排障需求，退出的容器并不会立即删除，除非手动 docker rm。
	- 我们这里只是随便执行个命令，看看结果，不需要排障和保留结果，因此使用 --rm 可以避免浪费空间。
	- centos ：这是指用centos  镜像为基础来启动容器。
	- bash：放在镜像名后的是命令，这里我们希望有个交互式 Shell，因此用的是 bash。

- 退出容器
  - exit

- 查看镜像、容器、数据卷所占用的空间
	- docker system df
- 其他
	- docker start 容器id
	- docker restart 容器id
	- docker stop 容器id
	- docker kill 容器id
	- docker commit 提交容器镜像

### Dockerfile
- FROM（指定基础image）
	> FROM <image>:<tag>
- RUN（执行命令）
	> RUN <command> (the command is run in a shell - `/bin/sh -c`)
	> RUN ["executable", "param1", "param2" ... ] (exec form)
- CMD（设置容器启动时执行的操作）
	> CMD ["executable","param1","param2"] (like an exec, this is the preferred form)
	> CMD command param1 param2 (as a shell)
- ENTRYPOINT（设置容器启动时执行的操作）
- EXPOSE（暴露容器端口）
- ENV（用于设置环境变量）
- ADD（从src复制文件到container的dest路径）
	> ADD <src> <dest>
- VOLUME（指定挂载点）
- WORKDIR（切换目录）

```dockerfile
#基础镜像，使用官方的centos7.8.2003
FROM centos:centos7.8.2003
#作者信息
MAINTAINER "再现理想"
#Nginx源码解包至容器
ADD nginx-1.18.0.tar.gz /opt
#切换工作目录
WORKDIR /opt/nginx-1.18.0
#容器内执行命令：安装编译依赖，创建用户和组，开始预编译，编译，安装
RUN yum -y install gcc pcre-devel openssl-devel make \
    && groupadd www-data && useradd -s /sbin/nologin -g www-data www-data \
    && ./configure \
    --prefix=/usr/local/nginx \
    --conf-path=/etc/nginx/nginx.conf \
    --user=www-data \
    --group=www-data \
    --with-pcre \
    --with-http_v2_module \
    --with-http_ssl_module \
    --with-http_realip_module \
    --with-http_addition_module \
    --with-http_sub_module \
    --with-http_dav_module \
    --with-http_flv_module \
    --with-http_mp4_module \
    --with-http_gunzip_module \
    --with-http_gzip_static_module \
    --with-http_random_index_module \
    --with-http_secure_link_module \
    --with-http_stub_status_module \
    --with-http_auth_request_module \
    --with-mail \
    --with-mail_ssl_module \
    --with-file-aio \
    --with-http_v2_module \
    --with-threads \
    --with-stream \
    --with-stream_ssl_module && make && make install
#设置要挂载到宿主机的目录
VOLUME  ["/usr/local/nginx/html"]
#设置nginx环境变量
ENV PATH /usr/local/nginx/sbin:$PATH 
#暴露80端口
EXPOSE 80
#容器启动时执行nginx命令
ENTRYPOINT ["nginx"]       
#nginx命令参数，CMD和ENTRYPOINT一期使用时将作为ENTRYPOINT的参数
CMD ["-g","daemon off;"]

```