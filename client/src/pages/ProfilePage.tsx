import { Card, Form, Input, Button, Typography, Avatar, Upload, message } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../store';
import { updateProfile } from '../features/auth/authSlice';

const { Title } = Typography;

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  const onFinish = async (values: { name: string; avatar?: string }) => {
    const result = await dispatch(updateProfile(values));
    if (updateProfile.fulfilled.match(result)) {
      message.success('更新成功');
    } else {
      message.error('更新失败');
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