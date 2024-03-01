import Form from 'antd/lib/form';
import Skeleton from 'antd/lib/skeleton';

interface Props {
  fieldCountBeforeNoteField: number
}

export default function EditPageSkeleton({ fieldCountBeforeNoteField }: Props) {
  const skeletonInputs = Array(fieldCountBeforeNoteField).fill(0).map((_, i) => (
    <Form.Item key={i} label={<Skeleton.Button active />}>
      <Skeleton.Input active />
    </Form.Item>
  ));

  return (
    <>
      {skeletonInputs}
      <Form.Item label={<Skeleton.Button active />}>
        <Skeleton paragraph={{ rows: 10 }} active />
      </Form.Item>
    </>
  );
}
