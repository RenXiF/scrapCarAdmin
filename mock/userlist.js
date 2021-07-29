const data={
		data:[{
			id:1,
			role:'管理员',
			username:'admin',
			email:'*******@163.com',
			time:'2020-05-25 10:23:34',
			content:'我是admin，我拥有最高权限，我可以控制角色',
			imgurl:'https://iconfont.alicdn.com/t/fe91cd63-885a-46c2-9d54-502b575860c5.png'
		},{
			id:2,
			role:'编辑',
			username:'edit',
			email:'**********@163.com',
			time:'2020-05-25 10:23:34',
			content:'我是eidt，我拥有一般权限，我不可以控制角色',
			imgurl:'https://iconfont.alicdn.com/t/432cea0f-1938-40c3-b309-b040a32feda2.png'
	   }],
	   cont:2
   }
export default{
    'post|/user/list':option=>{
       // let { token } = JSON.parse(option.body)
        return{
            code: 20000,
            data
        }
    }
}