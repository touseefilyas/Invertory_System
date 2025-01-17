import React, { useContext, useEffect, useRef, useState } from 'react';
import { Form, Input, Table } from 'antd';
import Button from '@mui/material/Button';

import {
  DeleteOutlined,
  EditOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const EditableContext = React.createContext(null);

const EditableRow = ({ ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

const Designation = () => {
  const [dataSource, setDataSource] = useState([]);
  // const [count, setCount] = useState(0);



  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => {
        const newData = data.map((user, index) => ({
          key: index.toString(),
          name: user.name,
          age: user.username,
          email: user.email,
          
          'Name': user.name,
          'Description': user.address.street,
          'Show Order': `${index + 1}`,
          'Stock': `Stock ${index}`,
          'In System': ` ${index}`,
          

        }));
        setDataSource(newData);
        setCount(newData.length);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);


  const handleSave = row => {
    const newData = [...dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'Name',
      editable: true,
      width: '30%',
    },
    {
      title: 'Description',
      dataIndex: 'Description',
      width: '30%',
    },
    {
      title: 'Show Order',
      dataIndex: 'Show Order',
    },
    {
      title: 'In System',
      dataIndex: 'In System',
    },
    
   
  ].map(col => ({
    ...col,
    onCell: record => ({
      record,
      editable: col.editable,
      dataIndex: col.dataIndex,
      title: col.title,
      handleSave,
    }),
  }));

  const navigate = useNavigate();

  function handleAddDesignationClick() {
    navigate('/addDesignation');
  }
  function handleEditDesignationClick() {
    navigate('/editDesignation');
  }

  return (
   <div style={{margin: '1rem'}}>
     <h1>Employee Designation</h1>
     <div>
       
       <Button
         onClick={handleAddDesignationClick}
         type="primary"
         style={{
           marginBottom: 16,
         }}
         variant="contained" color="primary"
       ><UserAddOutlined />&nbsp;
         Add Employee
       </Button>&nbsp;
 
 
 
       <Button onClick={handleEditDesignationClick} style={{
         marginBottom: 16,
       }} variant="contained" color="success"><EditOutlined />&nbsp;
         Edit Employee
       </Button>&nbsp;
 
       <Button style={{
         marginBottom: 16,
       }} variant="contained" color="warning"><DeleteOutlined />&nbsp;
         Delete
       </Button>
 
 
 
       <Table
         components={components}
         rowClassName={() => 'editable-row'}
         bordered
         dataSource={dataSource}
         columns={columns}
       />
     </div>
   </div>
  );
};

export default Designation;
