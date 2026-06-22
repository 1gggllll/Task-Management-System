import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  return (
    <div>
      <Title level={2}>欢迎使用任务管理系统</Title>
      <Paragraph>
        这是一个功能完整的任务管理系统，支持项目管理、任务分配、进度跟踪等功能。
      </Paragraph>
    </div>
  );
};

export default HomePage;