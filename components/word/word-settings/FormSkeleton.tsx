import { btnLayout, formLayout } from '@/lib/frontend/const';
import Form from 'antd/lib/form';
import Skeleton from 'antd/lib/skeleton';

export default function FormSkeleton() {
  // Skeleton.Input + 手动调组件内部的 span 的 width: 100% 才最贴切，还是不 hack 了，用 Skeleton 凑合一下
  return (
    <Form {...formLayout}>
      <Form.Item label={<Skeleton.Button active />}>
        <Skeleton paragraph={{ rows: 1 }} active />
      </Form.Item>
      <Form.Item label={<Skeleton.Button active />}>
        <Skeleton paragraph={{ rows: 1 }} active />
      </Form.Item>
      <Form.Item {...btnLayout}>
        <Skeleton.Button active />
      </Form.Item>
    </Form>
  );
}
