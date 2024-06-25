# easy302

最简单的302重定向实现方法, 作用是短链接, 通过边缘函数部署, `eo.js`为Edgeone的部署方法.

## 为什么有这个

有很多开源的cloudflare的部署方法,但是国内网络...重定向太慢

所以想通过EO来实现, 只需要一个json文件的网址, 就能最简单的使用. 

只适合少量数据的重定向需求.

## 使用方法

1. 部署自己的`url.json`
2. 把`eo.js`部署到EO, 修改json文件网址为自己的
3. 运行即可, 然后自行绑定触发规则

## 检查状态

访问`/status`, 会获得如下响应: 
```
{
  "service": "Redirect Service",
  "status": "OK",
  "redirectCount": 42,
  "lastUpdated": "2023-06-25T12:34:56.789Z"
}
```