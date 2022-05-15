import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import {
  Button, Dropdown, Menu, message, Modal, PageHeader, Space, Spin, Table,
} from 'antd';
import { DeleteFilled, DownOutlined, LoadingOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search';
import { ColumnsType } from 'antd/lib/table';
import { TableAction, TablePaginationConfig } from 'antd/lib/table/interface';
import { ServicesApi } from '@/services/services-api';
import styles from './style.module.scss';
import { PartInfoBase } from '@/services/entities';
import UpdateOrAddPart from './components/UpdateOrAddPart';
import { getUser } from '@/utils/storageUtils';

const cx = classNames.bind(styles);

const { SearchPartList, GetPartDetail, DeletePart } = ServicesApi;
interface PaginationProps {
  pageSize: number,
  current: number,
  total?: number,
}

const Quotation: React.FC = () => {
  const [pageLoading, setLoading] = useState(false);
  const [partList, setPartList] = useState<PartInfoBase[]>([]);
  const [editData, setEditData] = useState<PartInfoBase>();
  const [showAddOrEditModal, setShowAddOrEditModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [keyword, setKeyWord] = useState('');
  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [chooseIndex, setChooseIndex] = useState<number>();
  const [delConfirmFlag, setDelConfirmFlag] = useState(false);

  const onSearch = (value: string) => {
    if (value) {
      setKeyWord(value);
      setLoading(true);
      SearchPartList(
        {
          keyword: value,
          pageIndex: paginationData?.current,
          pageSize: paginationData?.pageSize,
        },
      ).then((res) => {
        setLoading(false);
      });
    }
  };
  const paginationChangeEvent = (page: number, pageSize: number, sort?: string) => {
    setLoading(true);
    setPartList([]);
    SearchPartList({
      pageSize, pageIndex: page, keyword,
    })
      .then((res) => {
        setLoading(false);
        setPaginationData({ ...paginationData, current: page, pageSize });
        setPartList(res.data.list);
      }).catch((err) => {
        // TODO
      });
  };

  const switchActionChange = (action: TableAction,
    pagination:TablePaginationConfig) => {
    if (action === 'paginate') {
      paginationChangeEvent(pagination.current ?? 1,
        pagination.pageSize ?? 10);
    }
  };
  const resetAllData = () => {
    setLoading(true);
    setKeyWord('');
    setPaginationData({ ...paginationData, current: 1, pageSize: 10 });
    getPartListMethod();
  };
  const getPartListMethod = () => {
    SearchPartList({ pageIndex: 1, pageSize: 20 }).then((res) => {
      setLoading(false);
      setPartList(res.data.list);
    });
  };
  const closeModal = (closeOnly?: boolean) => {
    setShowAddOrEditModal(false);
    if (!closeOnly) {
      getPartListMethod();
    }
  };
  const delEventOk = () => {
    setDelConfirmFlag(false);
    setLoading(true);
    DeletePart({ id: chooseIndex! }).then((res) => {
      message.success(res.message);
      getPartListMethod();
    }).catch((err) => {
      setLoading(false);
      setDelConfirmFlag(false);
    });
  };
  const columns: ColumnsType<PartInfoBase> = [
    {
      title: '创建者',
      dataIndex: 'createName',
      key: 'createName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '零件名称',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '零件价格',
      key: 'price',
      dataIndex: 'price',
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      render: (text, item) => (
        <div className={cx('operate-buttons')}>
          <Button
            type="default"
            onClick={() => {
              GetPartDetail({ id: item.id }).then((res) => {
                const { data } = res;
                console.log(data);
                setEditData({ ...data, id: item.id });
                setIsEdit(true);
                setShowAddOrEditModal(true);
              });
            }}
          >
            编辑
          </Button>
          <Button
            className={cx('del-button')}
            danger
            onClick={() => {
              setChooseIndex(item.id);
              setDelConfirmFlag(true);
            }}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: () => `共${paginationData?.total}条`,
    pageSize: paginationData?.pageSize,
    current: paginationData?.current,
    total: paginationData?.total,
  };
  const loadingIcon = () => <LoadingOutlined style={{ fontSize: 24 }} spin />;
  useEffect(() => {
    getPartListMethod();
  }, []);
  return (
    <>
      {showAddOrEditModal ? (
        <UpdateOrAddPart
          initData={editData}
          createName={getUser().userName}
          visible={showAddOrEditModal}
          isEdit={isEdit}
          closeEvent={closeModal}
        />
      ) : null}
      <Spin spinning={pageLoading} indicator={loadingIcon()}>
        <div className={cx('header')}>
          <PageHeader
            onBack={() => { }}
            className={cx('page-header')}
            title="报价参数管理列表"
          />
          <Modal
            title="确认删除"
            visible={delConfirmFlag}
            onCancel={() => setDelConfirmFlag(false)}
            onOk={delEventOk}
          >
            确定删除?
          </Modal>
          <div className={cx('buttons')}>
            <div className={cx('btns')}>
              <Search
                placeholder="输入关键词"
                onSearch={onSearch}
                onChange={(e) => {
                  setKeyWord(e.target.value);
                }}
                enterButton
                value={keyword}
              />
            </div>
            <div style={{ display: 'flex' }}>
              <Button
                style={{ marginRight: 10 }}
                type="primary"
                onClick={() => {
                  console.log('新增零件');
                  setShowAddOrEditModal(true);
                  setIsEdit(false);
                }}
              >
                新增
              </Button>
              <Button
                type="default"
                icon={<DeleteFilled />}
                onClick={resetAllData}
                disabled={keyword === '' && paginationData?.current === 1 && paginationData.pageSize === 10}
              >
                重置
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={partList}
            rowKey="id"
            onChange={(pagination, filters, sorter, extra) => {
              switchActionChange(extra.action, pagination);
            }}
            pagination={{
              ...paginationProps,
            }}
          />
        </div>
      </Spin>
    </>
  );
};

export default Quotation;
