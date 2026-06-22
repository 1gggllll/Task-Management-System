import Joi from 'joi';

export const authSchemas = {
  register: Joi.object({
    body: Joi.object({
      email: Joi.string().email().required().messages({
        'string.email': '请输入有效的邮箱地址',
        'any.required': '邮箱是必填项'
      }),
      password: Joi.string().min(6).required().messages({
        'string.min': '密码至少6个字符',
        'any.required': '密码是必填项'
      }),
      name: Joi.string().min(2).max(50).required().messages({
        'string.min': '用户名至少2个字符',
        'string.max': '用户名最多50个字符',
        'any.required': '用户名是必填项'
      })
    })
  }),

  login: Joi.object({
    body: Joi.object({
      email: Joi.string().email().required().messages({
        'string.email': '请输入有效的邮箱地址',
        'any.required': '邮箱是必填项'
      }),
      password: Joi.string().required().messages({
        'any.required': '密码是必填项'
      })
    })
  }),

  updateProfile: Joi.object({
    body: Joi.object({
      name: Joi.string().min(2).max(50).messages({
        'string.min': '用户名至少2个字符',
        'string.max': '用户名最多50个字符'
      }),
      avatar: Joi.string().uri().messages({
        'string.uri': '头像必须是有效的URL'
      })
    }).min(1).messages({
      'object.min': '至少需要更新一个字段'
    })
  })
};