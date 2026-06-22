export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    TODO: 'default',
    IN_PROGRESS: 'processing',
    IN_REVIEW: 'warning',
    DONE: 'success'
  };
  return colors[status] || 'default';
};

export const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    TODO: '待办',
    IN_PROGRESS: '进行中',
    IN_REVIEW: '审核中',
    DONE: '已完成'
  };
  return texts[status] || status;
};

export const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    LOW: 'green',
    MEDIUM: 'blue',
    HIGH: 'orange',
    URGENT: 'red'
  };
  return colors[priority] || 'blue';
};

export const getPriorityText = (priority: string): string => {
  const texts: Record<string, string> = {
    LOW: '低',
    MEDIUM: '中',
    HIGH: '高',
    URGENT: '紧急'
  };
  return texts[priority] || priority;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};