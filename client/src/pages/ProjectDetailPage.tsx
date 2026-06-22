import { Typography } from 'antd';
import { useParams } from 'react-router-dom';

const { Title } = Typography;

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div>
      <Title level={2}>项目详情</Title>
      <p>项目ID: {id}</p>
    </div>
  );
};

export default ProjectDetailPage;