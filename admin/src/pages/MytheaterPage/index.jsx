import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Image } from 'antd';
import apiCaller from '../../apis/apiCaller';
import { theaterApi } from '../../apis/manager/theaterApi';
import 'react-toastify/dist/ReactToastify.css';

export default function MytheaterPage() {
  const [data, setData] = useState();
  const theaterId = JSON.parse(localStorage.getItem('admin_user')).theater;
  const errorHandler = (error) => {
    toast.error(error.message, { autoClose: 3000, theme: 'colored' });
  };
  const getDetailTheater = async () => {
    const res = await apiCaller({
      request: theaterApi.detailTheater(theaterId),
      errorHandler,
    });

    if (res) {
      console.log(res.data);
      setData(res.data);
    }
  };
  useEffect(() => {
    getDetailTheater();
  }, []);
  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-2xl font-bold">{data?.name}</p>
        <Button>Sửa thông tin rạp</Button>
      </div>
      <div className="flex">
        <img alt="#" src={data?.logo} width={200} height={200} />
        <div className="ml-5">
          <p>address: {data?.address}</p>
          <p>hotline: {data?.hotline}</p>
          <p>email: {data?.email}</p>
          <p>description: {data?.description}</p>
        </div>
      </div>
      <div>
        <p>Ảnh rạp</p>
        <div className="grid grid-cols-5 gap-4">
          {data?.images.map((e, index) => (
            <img key={index} src={e} alt="img" />
          ))}
        </div>
      </div>
    </div>
  );
}
