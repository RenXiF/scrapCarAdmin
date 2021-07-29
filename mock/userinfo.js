const data={
    admin:{
        token:'admin-token',
		roles: ['admin'],
        username:'admin',
        imgurl:'https://iconfont.alicdn.com/t/fe91cd63-885a-46c2-9d54-502b575860c5.png'
    },
    edit:{
        token:'editor-token',
		roles: ['editor'],
        username:'editor',
        imgurl:'https://iconfont.alicdn.com/t/432cea0f-1938-40c3-b309-b040a32feda2.png'
    }
}

export default{
    'post|/user/info':option=>{
        let { token } = JSON.parse(option.body)
        if(token=='admin-token'){
            token = 'admin'
        }else{
            token = 'edit'
        }
        return{
            code: 20000,
            data:data[token]
        }
    }
}