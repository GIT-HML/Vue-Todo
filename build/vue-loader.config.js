module.exports = (isDev) => {
  return {
    preserveWhitepack: true, // 去除 template 模块中字符串首位的空格
    extractCSS: !isDev,
    cssModules: {
      localIdentName: isDev ? '[path]-[name]-[hash:base64:5]' : '[hash:base64:5]',
      camelCase: true
    }, 
  }
}