import {request} from '@/plugins/request';

// 文章标签
export const getTags = params => {
    return request({
        method: "GET",
        url: "/api/tags",
        params,
      });
}