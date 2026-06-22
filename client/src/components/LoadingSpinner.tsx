import { Spin } from 'antd';

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
}

const LoadingSpinner = ({ size = 'default', tip = '加载中...' }: LoadingSpinnerProps) => {
  return (
    <div style={{ textAlign: 'center', padding: '50px 0' }}>
      <Spin size={size} tip={tip}>
        <div style={{ padding: '50px' }} />
      </Spin>
    </div>
  );
};

export default LoadingSpinner;