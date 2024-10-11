import { ElMessage } from "element-plus";
import request from "./request";

async function post_code(code_list: string): Promise<any> {
    let res = await request.post('/code/send_code', code_list)
    if (res.status === 200) {
        console.log(res.data);
        return res.data;
    } else {
        ElMessage.error('Failed to send code');
        return null;
    }
}

export default post_code;