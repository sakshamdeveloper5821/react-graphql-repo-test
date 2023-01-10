import { SearchOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useQuery } from "@apollo/client";
import { LOAD_REPOS } from "./GraphQl/Queries";

interface DataType {
  name: string;
  stars: number;
  forks: number;
  key: string;
}

type DataIndex = keyof DataType;

const RepoTable: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const { data } = useQuery(LOAD_REPOS);
  const [, setRepoData] = useState<any>([]);
  const [sampleData, setSampleData] = useState<any>([]);
  useEffect(() => {
    if (data && data.user && data.user.pinnedItems) {
      setRepoData(data.user.pinnedItems);
      let nData = data?.user?.pinnedItems?.edges?.map((item: any) => {
        let { id, url, stargazers, forkCount } = item.node;
        return {
          key: id,
          name: url,
          stars: stargazers.totalCount,
          forks: forkCount,
        };
      });
      setSampleData(nData);
    }
  }, [data]);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Stars",
      dataIndex: "stars",
      key: "stars",
      width: "20%",
      sorter: (a, b) => a.stars - b.stars,
      ...getColumnSearchProps("stars"),
    },
    {
      title: "Forks",
      dataIndex: "forks",
      key: "forks",
      ...getColumnSearchProps("forks"),
      sorter: (a, b) => a.forks - b.forks,
      sortDirections: ["descend", "ascend"],
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={sampleData}
      scroll={{ x: 520 }}
      pagination={{ pageSizeOptions: ["6", "2"], showSizeChanger: true }}
    />
  );
};

export default RepoTable;
