import {
  Button,
  Card,
  Divider,
  Drawer,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  TimePicker,
  Upload,
} from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import dayjs from 'dayjs';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useRef, useState } from 'react';
import { CloseOutlined, DeleteOutlined, EditOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import apiCaller from '../../apis/apiCaller';
import { productApi } from '../../apis/manager/productApi';
import ModalDelete from '../../components/ModalDelete';
import { fareApi } from '../../apis/manager/fareApi';

export default function FarePage() {
  const [data, setData] = useState([]);
  const [specialDays, setSpecialDays] = useState([
    {
      value: '14/2',
      label: '14/2',
    },
    {
      value: '8/3',
      label: '8/3',
    },
    {
      value: '24/12',
      label: '24/12',
    },
    {
      value: '1/1',
      label: '1/1',
    },
    {
      value: '1/1 AL',
      label: '1/1 AL',
    },
    {
      value: '10/3 AL',
      label: '10/3 AL',
    },
    {
      value: '1/5',
      label: '1/5',
    },
    {
      value: '2/9',
      label: '2/9',
    },
  ]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [rowSelected, setRowSelected] = useState();
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [names, setNames] = useState('');

  const [form] = Form.useForm();
  const inputRef = useRef(null);

  const onNameChange = (event) => {
    setNames(event.target.value);
  };
  const errorHandler = (error) => {
    setLoading(false);
    toast.error(error.message, { autoClose: 3000, theme: 'colored' });
  };
  const deleteMovie = async () => {
    setDeleteLoading(true);
    const response = await apiCaller({
      request: productApi.deleteProduct(rowSelected),
      errorHandler,
    });
    if (response) {
      setIsModalOpenDelete(false);
      toast.success('Xóa sản phẩm thành công!');
      setDeleteLoading(false);
      getListFare();
    }
  };
  const onFinish = async (values) => {
    setLoading(true);
    const body = {
      normalDay: values.normalDay.join(','),
      weekend: values.weekend.join(','),
      specialDay: values.specialDay.join(','),
      description: {
        en: values.description_en,
        vi: values.description_vi,
      },
      u22: Number(values.u22),
      _2d: values._2d.map((val) => {
        return {
          from: val.from && val.from.format('HH:mm'),
          to: val.to && val.to.format('HH:mm'),
          seat: [
            {
              type: 'Standard',
              normalDayPrice: Number(val.normalDayPrice_standard),
              specialDayPrice: Number(val.specialDayPrice_standard),
            },
            {
              type: 'VIP',
              normalDayPrice: Number(val.normalDayPrice_vip),
              specialDayPrice: Number(val.specialDayPrice_vip),
            },
            {
              type: 'Sweetbox',
              normalDayPrice: Number(val.normalDayPrice_sweetbox),
              specialDayPrice: Number(val.specialDayPrice_sweetbox),
            },
          ],
        };
      }),
      _3d: values._3d.map((val) => {
        return {
          from: val.from && val.from.format('HH:mm'),
          to: val.to && val.to.format('HH:mm'),
          seat: [
            {
              type: 'Standard',
              normalDayPrice: Number(val.normalDayPrice_standard),
              specialDayPrice: Number(val.specialDayPrice_standard),
            },
            {
              type: 'VIP',
              normalDayPrice: Number(val.normalDayPrice_vip),
              specialDayPrice: Number(val.specialDayPrice_vip),
            },
            {
              type: 'Sweetbox',
              normalDayPrice: Number(val.normalDayPrice_vip),
              specialDayPrice: Number(val.specialDayPrice_sweetbox),
            },
          ],
        };
      }),
      surcharge: [
        {
          name: 'Sneakshow',
          value: Number(values.surcharge1),
        },
        {
          name: 'Blockbuster',
          value: Number(values.surcharge2),
        },
      ],
    };
    const response = await apiCaller({
      request: fareApi.addFare(body),
      errorHandler,
    });
    if (response) {
      setIsOpen(false);
      toast.success('Thêm bảng giá thành công!');
      form.resetFields();
      setLoading(false);
      getListFare();
    }
  };
  const getListFare = async () => {
    setLoadingTable(true);
    const response = await apiCaller({
      request: fareApi.listFare(),
      errorHandler,
    });
    if (response) {
      setLoadingTable(false);
      setData(response?.data);
    }
  };
  const columns = [
    {
      title: 'Phim 2D',
      children: [
        {
          title: 'Thời gian',
          dataIndex: 'time_2d',
          render: (text) =>
            text?.map((e, index) => (
              <div key={index}>
                {e.from || 'trước'} - {e.to}
              </div>
            )),
          onCell: (val, index) => {
            if (val) {
              return {
                rowSpan: val?.time_2d?.length,
              };
            }
            return {};
          },
        },
        {
          title: 'Loại ghế',
          dataIndex: 'seat_2d',
          // render: (text) => text?.map((e) => e?.map((value, index) => console.log(value))),
          onCell: (val, index) => {
            if (val) {
              return {
                rowSpan: val?.seat_2d?.length,
              };
            }
            return {};
          },
        },
        {
          title: 'Giá vé',
          children: [
            {
              title: 'Ngày thường',
              dataIndex: 'normalDay_2d',
              // render: (text) => text.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
            },
            {
              title: 'Ngày lễ',
              dataIndex: 'specialDay_2d',
              // render: (text) => text.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
            },
          ],
        },
      ],
    },
    {
      title: 'Phim 3D',
      children: [
        {
          title: 'Thời gian',
          dataIndex: 'time_3d',
          render: (text) =>
            text?.map((e, index) => (
              <div key={index}>
                {e.from} - {e.to}
              </div>
            )),
        },
        {
          title: 'Loại ghế',
          dataIndex: 'seat_3d',
        },
        {
          title: 'Giá vé',
          children: [
            {
              title: 'Ngày thường',
              dataIndex: 'normalDay_3d',
              // render: (text) => text.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
            },
            {
              title: 'Ngày lễ',
              dataIndex: 'specialDay_3d',
              // render: (text) => text.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
            },
          ],
        },
      ],
    },
  ];
  const dataTable = [
    {
      time_2d: data._2d,
      // seat_2d: data._2d,
      time_3d: data._3d,
    },
  ];

  console.log(data);
  useEffect(() => {
    getListFare();
  }, []);
  const days = [
    {
      value: 0,
      label: 'Chủ nhật',
    },
    {
      value: 1,
      label: 'Thứ hai',
    },
    {
      value: 2,
      label: 'Thứ ba',
    },
    {
      value: 3,
      label: 'Thứ tứ',
    },
    {
      value: 4,
      label: 'Thứ năm',
    },
    {
      value: 5,
      label: 'Thứ sáu',
    },
    {
      value: 6,
      label: 'Thứ bảy',
    },
  ];
  const addItem = (e) => {
    e.preventDefault();
    setSpecialDays([...specialDays, { value: names, label: names }]);
    setNames('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
  const addDay = (menu) => (
    <>
      {menu}
      <Divider
        style={{
          margin: '8px 0',
        }}
      />
      <Space
        style={{
          padding: '0 8px 4px',
        }}
        className="flex justify-between"
      >
        <Input
          placeholder="Please enter item"
          ref={inputRef}
          value={names}
          onChange={onNameChange}
          onKeyDown={(e) => e.stopPropagation()}
        />
        <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
          Thêm
        </Button>
      </Space>
    </>
  );
  const format = 'HH:mm';
  return (
    <div>
      <div className="flex justify-between">
        <p className="text-3xl font-bold mt-0">Quản lý bảng giá</p>
        {data === undefined ? (
          <Button onClick={() => setIsOpen(true)}>Thêm bảng giá</Button>
        ) : (
          <Button onClick={() => setIsOpen(true)}>Sửa bảng giá</Button>
        )}
      </div>
      <Table
        pagination={false}
        bordered
        loading={loadingTable}
        columns={columns}
        dataSource={dataTable}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              setRowSelected(record._id);
            },
          };
        }}
      />
      <div className="grid grid-cols-2">
        <div>
          <p className="font-bold">Chú ý:</p>
          <ul>
            <li>
              U22 (23 tuổi trở xuống) :{' '}
              <span className="font-bold">
                {Number(data?.u22).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </span>
            </li>
            <li>
              Ngày lễ: <span> {data?.specialDay}</span>
            </li>
            <li>
              Ngày thường: <span> {data?.normalDay}</span>
            </li>
            <li>
              Cuối tuần: <span> {data?.weekend}</span>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-bold">Phụ phí:</p>
          <ul>
            <li>
              Chiếu sớm :{' '}
              <span className="font-bold">
                {Number(data?.surcharge?.[0].value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </span>
            </li>
            <li>
              Bom tấn :{' '}
              <span className="font-bold">
                {Number(data?.surcharge?.[1].value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <ToastContainer />
      <Drawer width={1250} footer={null} onClose={() => setIsOpen(false)} closeIcon={false} open={isOpen}>
        <Form labelWrap form={form} labelCol={{ span: 2 }} onFinish={onFinish} labelAlign="left">
          <p className="text-3xl font-bold mt-0"> Tạo bảng giá</p>
          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              labelCol={{ span: 5 }}
              name="normalDay"
              label="Ngày thường"
              rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
            >
              <Select mode="multiple" placeholder="Chọn ngày" options={days} />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 5 }}
              name="weekend"
              label="Ngày cuối tuần"
              rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
            >
              <Select mode="multiple" placeholder="Chọn ngày" options={days} />
            </Form.Item>
          </div>
          <Form.Item
            labelCol={{ span: 2 }}
            name="specialDay"
            label="Ngày lễ"
            rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
          >
            <Select
              className="pl-[22px]"
              mode="multiple"
              placeholder="Chọn ngày"
              dropdownRender={addDay}
              options={specialDays}
            />
          </Form.Item>
          <div className="grid grid-cols-2 gap-5">
            <Form.Item name="description_vi" label="Mô tả (vi)" labelCol={{ span: 5 }}>
              <Input.TextArea placeholder="Mô tả tiếng việt" autoSize={{ maxRows: 3, minRows: 3 }} />
            </Form.Item>
            <Form.Item name="description_en" label="Mô tả (en)" labelCol={{ span: 5 }}>
              <Input.TextArea placeholder="Mô tả tiếng anh" autoSize={{ maxRows: 3, minRows: 3 }} />
            </Form.Item>
          </div>
          <div className="grid grid-cols-3 gap-5">
            <Form.Item
              name="u22"
              labelCol={{ span: 5 }}
              label="U22"
              rules={[
                { required: true, message: 'Vui lòng nhập giá!' },
                {
                  pattern: /^[0-9]+$/,
                  message: 'Giá phải bằng số!',
                },
              ]}
            >
              <Input placeholder="Giá vé" />
            </Form.Item>
            <Form.Item
              name="surcharge1"
              labelCol={{ span: 5 }}
              label="Phụ phí"
              rules={[
                {
                  pattern: /^[0-9]+$/,
                  message: 'Giá phải bằng số!',
                },
              ]}
            >
              <Input placeholder="Chiếu sớm" />
            </Form.Item>
            <Form.Item
              name="surcharge2"
              rules={[
                {
                  pattern: /^[0-9]+$/,
                  message: 'Giá phải bằng số!',
                },
              ]}
            >
              <Input placeholder="Bom tấn" />
            </Form.Item>
          </div>
          <p className="text-xl font-bold">Phim 2D</p>
          <Form.List name="_2d" rules={[{ required: true, message: 'Vui lòng thêm giá!' }]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: 'flex',
                      marginBottom: 8,
                    }}
                    align="baseline"
                  >
                    <Form.Item {...restField} name={[name, 'from']} labelCol={{ span: 7 }} initialValue="" label="Từ">
                      <TimePicker className="w-20" placeholder="Giờ" format={format} />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'to']} labelCol={{ span: 7 }} initialValue="" label="Đến">
                      <TimePicker className="w-20" format={format} placeholder="Giờ" />
                    </Form.Item>
                    <div>
                      <Form.Item
                        {...restField}
                        name={[name, 'normalDayPrice_standard']}
                        labelCol={{ span: 9 }}
                        label="Ghế thường"
                        rules={[
                          { required: true, message: 'Vui lòng điền giá!' },
                          {
                            pattern: /^[0-9]+$/,
                            message: 'Giá phải bằng số!',
                          },
                        ]}
                      >
                        <Input placeholder="Giá ngày thường" />
                      </Form.Item>
                      <Form.Item
                        className="ml-[105px]"
                        {...restField}
                        name={[name, 'specialDayPrice_standard']}
                        rules={[
                          { required: true, message: 'Vui lòng điền giá!' },
                          {
                            pattern: /^[0-9]+$/,
                            message: 'Giá phải bằng số!',
                          },
                        ]}
                      >
                        <Input className="w-[177px]" placeholder="Giá ngày lễ" />
                      </Form.Item>
                    </div>
                    <div>
                      <Form.Item
                        {...restField}
                        name={[name, 'normalDayPrice_vip']}
                        rules={[
                          { required: true, message: 'Vui lòng nhập giá!' },
                          {
                            pattern: /^[0-9]+$/,
                            message: 'Giá phải bằng số!',
                          },
                        ]}
                        labelCol={{ span: 9 }}
                        label="Ghế VIP"
                      >
                        <Input placeholder="Giá ngày thường" />
                      </Form.Item>
                      <Form.Item
                        className="ml-[105px]"
                        {...restField}
                        name={[name, 'specialDayPrice_vip']}
                        rules={[
                          { required: true, message: 'Vui lòng nhập giá!' },
                          {
                            pattern: /^[0-9]+$/,
                            message: 'Giá phải bằng số!',
                          },
                        ]}
                      >
                        <Input className="w-[177px]" placeholder="Giá ngày lễ" />
                      </Form.Item>
                    </div>
                    <div>
                      <Form.Item
                        {...restField}
                        name={[name, 'normalDayPrice_sweetbox']}
                        rules={[
                          { required: true, message: 'Vui lòng nhập giá!' },
                          {
                            pattern: /^[0-9]+$/,
                            message: 'Giá phải bằng số!',
                          },
                        ]}
                        labelCol={{ span: 9 }}
                        label="Ghế đôi"
                      >
                        <Input placeholder="Giá ngày thường" />
                      </Form.Item>
                      <Form.Item
                        className="ml-[105px]"
                        {...restField}
                        name={[name, 'specialDayPrice_sweetbox']}
                        rules={[
                          { required: true, message: 'Vui lòng nhập giá!' },
                          {
                            pattern: /^[0-9]+$/,
                            message: 'Giá phải bằng số!',
                          },
                        ]}
                      >
                        <Input className=" w-[177px]" placeholder="Giá ngày lễ" />
                      </Form.Item>
                    </div>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm giá
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <p className="text-xl font-bold">Phim 3D</p>
          <Form.List name="_3d" rules={[{ required: true, message: 'Vui lòng thêm giá!' }]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: 'flex',
                      marginBottom: 8,
                    }}
                    align="baseline"
                  >
                    <Form.Item {...restField} name={[name, 'from']} labelCol={{ span: 7 }} initialValue="" label="Từ">
                      <TimePicker className="w-20" placeholder="Giờ" format={format} />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'to']} labelCol={{ span: 7 }} initialValue="" label="Đến">
                      <TimePicker className="w-20" format={format} placeholder="Giờ" />
                    </Form.Item>
                    <div>
                      <Form.Item
                        {...restField}
                        name={[name, 'normalDayPrice_standard']}
                        labelCol={{ span: 9 }}
                        label="Ghế thường"
                        rules={[
                          { required: true, message: 'Vui lòng điền giá!' },
                          {
                            pattern: /^[0-9]+$/,
                            message: 'Giá phải bằng số!',
                          },
                        ]}
                      >
                        <Input placeholder="Giá ngày thường" />
                      </Form.Item>
                      <Form.Item
                        className="ml-[105px]"
                        {...restField}
                        name={[name, 'specialDayPrice_standard']}
                        rules={[
                          { required: true, message: 'Vui lòng điền giá!' },
                          {
                            pattern: /^[0-9]+$/,
                            message: 'Giá phải bằng số!',
                          },
                        ]}
                      >
                        <Input className="w-[177px]" placeholder="Giá ngày lễ" />
                      </Form.Item>
                    </div>
                    <div>
                      <Form.Item
                        {...restField}
                        name={[name, 'normalDayPrice_vip']}
                        rules={[
                          { required: true, message: 'Vui lòng điền giá!' },
                          {
                            pattern: /^[0-9]+$/,
                            message: 'Giá phải bằng số!',
                          },
                        ]}
                        labelCol={{ span: 9 }}
                        label="Ghế VIP"
                      >
                        <Input placeholder="Giá ngày thường" />
                      </Form.Item>
                      <Form.Item
                        className="ml-[105px]"
                        {...restField}
                        name={[name, 'specialDayPrice_vip']}
                        rules={[
                          { required: true, message: 'Vui lòng điền giá!' },
                          {
                            pattern: /^[0-9]+$/,
                            message: 'Giá phải bằng số!',
                          },
                        ]}
                      >
                        <Input className="w-[177px]" placeholder="Giá ngày lễ" />
                      </Form.Item>
                    </div>
                    <div>
                      <Form.Item
                        {...restField}
                        name={[name, 'normalDayPrice_sweetbox']}
                        rules={[
                          { required: true, message: 'Vui lòng điền giá!' },
                          {
                            pattern: /^[0-9]+$/,
                            message: 'Giá phải bằng số!',
                          },
                        ]}
                        labelCol={{ span: 9 }}
                        label="Ghế đôi"
                      >
                        <Input placeholder="Giá ngày thường" />
                      </Form.Item>
                      <Form.Item
                        className="ml-[105px]"
                        {...restField}
                        name={[name, 'specialDayPrice_sweetbox']}
                        rules={[
                          { required: true, message: 'Vui lòng điền giá!' },
                          {
                            pattern: /^[0-9]+$/,
                            message: 'Giá phải bằng số!',
                          },
                        ]}
                      >
                        <Input className="w-[177px]" placeholder="Giá ngày lễ" />
                      </Form.Item>
                    </div>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm giá
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item className="text-center mb-0">
            <Button loading={loading} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      <ModalDelete
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onCancel={() => setIsModalOpenDelete(false)}
        okButtonProps={{ loading: deleteLoading }}
        onOk={deleteMovie}
      >
        <div>Bạn có chắc xóa sản phẩm này không?</div>
      </ModalDelete>
    </div>
  );
}
