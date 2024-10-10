import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import hljs from 'highlight.js' //导入代码高亮文件
import 'highlight.js/styles/github.css' 

createApp(App)
    .directive('highlight', function (el) {
    const blocks = el.querySelectorAll('pre code');
    blocks.forEach((block: any) => {
        hljs.highlightBlock(block)
    })
})
    .use(router)
    .use(ElementPlus)
    .mount('#app')
