const tokens = {
    admin: {
        token: 'admin-token',
		pass: 'bfc123456789'
    },
    editor: {
        token: 'editor-token',
		pass: '123456'
    }
}
export default{
    'post|/user/login':option=>{
		// console.log(option)
        const { username } = JSON.parse(option.body)
        const { password } = JSON.parse(option.body)
        const token = tokens[username]
		// console.log(username)
		// console.log(password)
		// console.log(token)
		// console.log(tokens[username])
		if(tokens[username]===undefined && username != tokens[username]){
			return {
			    code: 60204,
			    message: '请输入正确的账号密码',
			}
		}
        if (password != tokens[username].['pass']) {
            return {
                code: 60204,
                message: '请输入正确的密码',
            }
        }
        if (!token) {
            return {
                code: 60204,
                message: '账号和密码不正确'
            }
        }
        return{
            code: 20000,
            data:token
        }
    }
}