import Joi from 'joi';

export const projectSchemas = {
  create: Joi.object({
    body: Joi.object({
      name: Joi.string().min(2).max(100).required().messages({
        'string.min': '项目名称至少2个字符',
        'string.max': '项目名称最多100个字符',
        'any.required': '项目名称是必填项'
      }),
      description: Joi.string().max(500).messages({
        'string.max': '项目描述最多500个字符'
      })
    })
  }),

  update: Joi.object({
    body: Joi.object({
      name: Joi.string().min(2).max(100).messages({
        'string.min': '项目名称至少2个字符',
        'string.max': '项目名称最多100个字符'
      }),
      description: Joi.string().max(500).messages({
        'string.max': '项目描述最多500个字符'
      })
    }).min(1).messages({
      'object.min': '至少需要更新一个字段'
    })
  }),

  addMember: Joi.object({
    body: Joi.object({
      userId: Joi.string().required().messages({
        'any.required': '用户ID是必填项'
      }),
      role: Joi.string().valid('ADMIN', 'MEMBER', 'VIEWER').default('MEMBER')
    })
  })
};