import { da } from 'element-plus/es/locales.mjs'
import Mock from 'mockjs'

const Random = Mock.Random

Mock.mock('http://localhost:8080/code/send_code', 'post', function(){
    console.log('mock send_code');
    return{
        tags: ['error', 'warning', 'info'],
        message: [
            {'error': '我吃好了'},
            {'warning': '我没吃好'},
            {'info': '我又吃好了'},
            {'info': '我aaa吃好了'}
        ]
    }
})