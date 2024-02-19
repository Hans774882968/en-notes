import { CommonObjectType } from '@/typings/global';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import React, { ReactNode, forwardRef, useImperativeHandle } from 'react';


export interface SearchFormRef {
  resetFields: (field?: string[]) => void
}

export interface SearchProps {
  config: SearchFieldProps[];
  handleSearch: (arg0: object) => void;
  beforeSearch?: (arg0: object) => void;
  onFieldsChange?: (arg0?: unknown, arg1?: unknown) => void;
}

interface SearchFieldProps {
  key: string
  label: string
  rules?: object[]
  slot: ReactNode
  initialValue?: unknown
  fn?: (initialValue: unknown) => unknown
}

const SearchForm = forwardRef<SearchFormRef, SearchProps>(
  (props, ref) => {
    const { config, handleSearch, beforeSearch, onFieldsChange } = props;
    const [form] = Form.useForm();
    const getFields = () => {
      return config.map((item) => {
        return (
          <Form.Item
            key={item.key}
            name={item.key}
            label={item.label}
            rules={item.rules}
            style={{ marginBottom: '6px' }}
          >
            {item.slot}
          </Form.Item>
        );
      });
    };

    const emitSearch = (values: object): void => {
      // beforeSearch用于处理一些特殊情况
      beforeSearch && beforeSearch(values);
      handleSearch(values);
    };

    const initialValues = config.reduce(
      (prev: CommonObjectType, next: CommonObjectType) => ({
        ...prev,
        [next.key]: next.initialValue
      }),
      {}
    );

    useImperativeHandle(ref, () => ({
      // 重置搜索字段
      resetFields(field?: string[]) {
        return field ? form.resetFields([...field]) : form.resetFields();
      }
    }));

    return (
      <Form
        form={form}
        initialValues={initialValues}
        onFieldsChange={onFieldsChange}
        layout="inline"
        onFinish={emitSearch}
        style={{ marginBottom: 10 }}
      >
        {getFields()}
        <Form.Item>
          <Button htmlType="submit" type="primary">
            Search
          </Button>
        </Form.Item>
      </Form>
    );
  }
);

SearchForm.displayName = 'SearchForm';

SearchForm.defaultProps = {
  beforeSearch: () => {},
  onFieldsChange: () => {}
};

export default SearchForm;
