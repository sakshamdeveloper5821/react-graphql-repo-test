import { Col, Row, Typography } from "antd";
import RepoTable from "./Table";
const { Title } = Typography;

const styles: any = {
  rowStyles: {
    background: "#eee",
    height: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  titleStyle: {
    textAlign: "center",
    marginBottom: 12,
    textTransform: "uppercase",
    textDecoration: "underline",
  },
};

const GetRepos: React.FC = () => {
  return (
    <Row style={styles.rowStyles} gutter={{ xs: 12, sm: 16, md: 24, lg: 32 }}>
      <Col style={{ marginTop: 24 }}>
        <Title level={3} style={styles.titleStyle}>
          Repository Table
        </Title>
        <RepoTable />
      </Col>
    </Row>
  );
};

export default GetRepos;
