import { Card, Form, Input, Button, Typography, Avatar, Upload, message } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../store';
import { useState } from 'react';

const { Title } = Typography;

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { name: string; avatar?: string }) => {
    setLoading(true);
    try {
      // TODO: 实现更新用户信息
      message.success('更新成功');
    } catch (error) {
      message.error('更新失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>个人资料</Title>
      
      <Card style={{ maxWidth: 600 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar size={100} icon={<UserOutlined />} src={user?.avatar} />
          <div style={{ marginTop: 16 }}>
            <Upload showUploadList={false}>
              <Button icon={<UploadOutlined />}>更换头像</Button>
            </Upload>
          </div>
        </div>

        <Form
          layout="vertical"
          initialValues={{
            name: user?.name,
            email: user?.email
          }}
          onFinish={onFinish}
        >
          <Form.Item
            label="邮箱"
            name="email"
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="用户名"
            name="name"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProfilePage;