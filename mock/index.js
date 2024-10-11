import { da } from 'element-plus/es/locales.mjs'
import Mock from 'mockjs'

const Random = Mock.Random

Mock.mock('http://localhost:8080/code/send_code', 'post', function(){
    console.log('mock send_code');
    return{
        tags: ['error', 'warning', 'info'],
        message: 'error at xxxx'
    }
})