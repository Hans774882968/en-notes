import Message from 'antd/lib/message';

export default function errorGeneralHelper(err: unknown, backupMessage?: string) {
  const content = err?.message || backupMessage || 'unknown error';
  console.error(content, err);
  Message.error({
    content
  });
}
