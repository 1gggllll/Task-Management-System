import Joi from 'joi';

export const taskSchemas = {
  create: Joi.object({
    body: Joi.object({
      title: Joi.string().min(2).max(200).required().messages({
        'string.min': '任务标题至少2个字符',
        'string.max': '任务标题最多200个字符',
        'any.required': '任务标题是必填项'
      }),
      description: Joi.string().max(1000).messages({
        'string.max': '任务描述最多1000个字符'
      }),
      status: Joi.string().valid('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE').default('TODO'),
      priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').default('MEDIUM'),
      assigneeId: Joi.string().allow(null, ''),
      dueDate: Joi.date().iso().messages({
        'date.format': '截止日期必须是有效的ISO日期格式'
      })
    })
  }),

  update: Joi.object({
    body: Joi.object({
      title: Joi.string().min(2).max(200).messages({
        'string.min': '任务标题至少2个字符',
        'string.max': '任务标题最多200个字符'
      }),
      description: Joi.string().max(1000).messages({
        'string.max': '任务描述最多1000个字符'
      }),
      status: Joi.string().valid('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'),
      priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
      assigneeId: Joi.string().allow(null, ''),
      dueDate: Joi.date().iso().messages({
        'date.format': '截止日期必须是有效的ISO日期格式'
      })
    }).min(1).messages({
      'object.min': '至少需要更新一个字段'
    })
  }),

  updateStatus: Joi.object({
    body: Joi.object({
      status: Joi.string().valid('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE').required().messages({
        'any.required': '任务状态是必填项',
        'any.only': '无效的任务状态'
      })
    })
  }),

  updateAssignee: Joi.object({
    body: Joi.object({
      assigneeId: Joi.string().allow(null, '').required().messages({
        'any.required': ' assigneeId是必填项'
      })
    })
  })
};