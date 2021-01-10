const cookieParser = process.server ? require('cookieparser') : undefined

export const state = () => {
    return {
        // 当登录用户的登录状态
        user: null,
    }
}


export const mutations = {
    setUser(state, user) {
        state.user = user
    }
}

export const actions = {
    // // 服务端渲染自动运行
    // // 作用：初始化容器数据
    nuxtServerInit({commit}, {req}) {
        let user = null;

        if(req.headers.cookie) {
            const parsed = cookieParser.parse(req.headers.cookie);
            try {
                user = JSON.parse(parsed.user)
            } catch (err) {
                // No valid cookie found
            }
        }
        commit('setUser', user);

    }
}
