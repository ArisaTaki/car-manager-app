import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import {
  Button, message, Modal, PageHeader, Spin, Table,
} from 'antd';
import { DeleteFilled, LoadingOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search';
import { ColumnsType } from 'antd/lib/table';
import { TableAction, TablePaginationConfig } from 'antd/lib/table/interface';
import moment from 'moment';
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
  const [getDataLoading, setGetDataLoading] = useState(false);

  const getPartListMethod = () => {
    setLoading(true);
    SearchPartList({ pageIndex: 1, pageSize: 10, keyword: '' }).then((res) => {
      setLoading(false);
      setPartList(res.data.list);
      setPaginationData({
        pageSize: 10,
        current: 1,
        total: res.data.total,
      });
    });
  };

  useEffect(() => {
    getPartListMethod();
  }, []);

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
        setPartList(res.data.list);
        setLoading(false);
        setPaginationData({
          pageSize: 10,
          current: 1,
          total: res.data.total,
        });
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

  const closeModal = (closeOnly?: boolean) => {
    setShowAddOrEditModal(false);
    if (!closeOnly) {
      resetAllData();
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
      title: '?????????',
      dataIndex: 'createName',
      key: 'createName',
    },
    {
      title: '????????????',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => (
        <span>{moment(text).format('YYYY???MM???DD???')}</span>
      ),
    },
    {
      title: '????????????',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '????????????',
      key: 'price',
      dataIndex: 'price',
    },
    {
      title: '??????',
      key: 'action',
      dataIndex: 'action',
      render: (text, item) => (
        <div className={cx('operate-buttons')}>
          <Button
            disabled={getDataLoading}
            type="default"
            onClick={() => {
              setGetDataLoading(true);
              GetPartDetail({ id: item.id }).then((res) => {
                setGetDataLoading(false);
                const { data } = res;
                setEditData({ ...data, id: item.id });
                setIsEdit(true);
                setShowAddOrEditModal(true);
              });
            }}
          >
            ??????
          </Button>
          <Button
            className={cx('del-button')}
            danger
            onClick={() => {
              setChooseIndex(item.id);
              setDelConfirmFlag(true);
            }}
          >
            ??????
          </Button>
        </div>
      ),
    },
  ];
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: () => `???${paginationData?.total}???`,
    pageSize: paginationData?.pageSize,
    current: paginationData?.current,
    total: paginationData?.total,
  };
  const loadingIcon = () => <LoadingOutlined style={{ fontSize: 24 }} spin />;
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
            title="????????????????????????"
          />
          <Modal
            title="????????????"
            visible={delConfirmFlag}
            onCancel={() => setDelConfirmFlag(false)}
            onOk={delEventOk}
          >
            ?????????????
          </Modal>
          <div className={cx('buttons')}>
            <div className={cx('btns')}>
              <Search
                placeholder="???????????????"
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
                  console.log('????????????');
                  setShowAddOrEditModal(true);
                  setIsEdit(false);
                }}
              >
                ??????
              </Button>
              <Button
                type="default"
                icon={<DeleteFilled />}
                onClick={resetAllData}
                disabled={keyword === '' && paginationData?.current === 1 && paginationData.pageSize === 10}
              >
                ??????
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
