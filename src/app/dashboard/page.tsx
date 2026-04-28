"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import axios, { AxiosResponse } from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, ButtonGroup, Button } from "react-bootstrap";

import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart,
  ChartData,
  ChartOptions,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  LineController,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  ChartDataset,
} from "chart.js";
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

import { barChartData, barChartOptions } from "./bar_consts.ts";
import { pieChartData, pieChartOptions } from "./pie_consts.ts";
import { lineChartData, lineChartOptions } from "./line_consts.ts";

import {
  ResponseForBarChart,
  ResponseForLineChart,
  ResponseForPieChart,
  CategoricalSales,
  PeriodEnum,
  SortEnum,
} from "./insight_types.ts";

export default function InsightsPage() {
  const router = useRouter();

  useEffect(() => {
    const branchToken = localStorage.getItem("branch-token");
    if (!branchToken) {
      router.push("/branches");
    }
  }, [router]);

  return (
    <Container className="bg-light p-3 d-flex flex-column" fluid>
      <Row className="mb-3" style={{ height: "500px" }}>
        <Col md={6} className="h-100">
          <TopMenusChart />
        </Col>
        <Col md={6} className="h-100">
          <SalesCountNumber />
        </Col>
      </Row>
      <Row style={{ height: "500px" }}>
        <Col className="h-100">
          <SalesByPeriodChart />
        </Col>
      </Row>
    </Container>
  );
}

function TopMenusChart() {
  const [sortBy, setSortBy] = useState<SortEnum>(SortEnum.QUANTITY);

  return (
    <Container className="bg-white h-100 rounded-3 p-3 d-flex flex-column">
      <ButtonGroup className="mb-3" role="group" aria-label="Top menus sold">
        <Button
          variant={sortBy === SortEnum.QUANTITY ? "primary" : "outline-primary"}
          onClick={() => {
            setSortBy(SortEnum.QUANTITY);
          }}
        >
          {SortEnum.QUANTITY}
        </Button>
        <Button
          variant={sortBy === SortEnum.REVENUE ? "primary" : "outline-primary"}
          onClick={() => {
            setSortBy(SortEnum.REVENUE);
          }}
        >
          {SortEnum.REVENUE}
        </Button>
      </ButtonGroup>
      <Container style={{ height: "90%", width: "100%", position: "relative" }}>
        <PieChartSales
          pieChartData={pieChartData}
          pieChartOptions={{
            ...pieChartOptions,
            maintainAspectRatio: false,
            responsive: true,
          }}
          sortBy={sortBy}
        />
      </Container>
    </Container>
  );
}
interface PieChartSalesProps {
  pieChartData: ChartData<"pie">;
  pieChartOptions: ChartOptions<"pie">;
  sortBy: SortEnum;
}
function PieChartSales({
  pieChartData,
  pieChartOptions,
  sortBy,
}: PieChartSalesProps) {
  const [chartData, setChartData] = useState(pieChartData);
  const [chartOptions, setChartOptions] = useState(pieChartOptions);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);

        const insightResponse: AxiosResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/insights/top-menus-by-${sortBy}`,
          {
            headers: {
              "branch-token": localStorage.getItem("branch-token"),
            },
            validateStatus: () => true,
          }
        );
        if (insightResponse?.status === 401) {
          localStorage.removeItem("branch-token");
          router.push("/branches");
          return;
        }
        if (insightResponse.status !== 200) {
          setError("Unable to fetch sales data");
          throw new Error("Unable to fetch sales data");
        }

        const responseBody: ResponseForPieChart = insightResponse.data;
        const { message } = responseBody;
        const { labels, data } = responseBody.insight;
        setChartData({
          ...chartData,
          labels,
          datasets: [
            {
              ...chartData.datasets[0],
              label: `${sortBy === SortEnum.QUANTITY ? "Quantity" : "Revenue"} sold`,
              data,
            },
          ],
        });
        setChartOptions({
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            title: {
              ...chartOptions.plugins?.title,
              text: `Top 5 Menus Sold by ${
                sortBy === SortEnum.QUANTITY ? "Quantity" : "Revenue"
              }`,
            },
          },
        });
        console.log(`Fetched top menus sold: `, message);
      } catch (err) {
        setError("Failed to fetch top menus sold.");
        console.error("Error fetching top menus sold:", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchSalesData();
  }, [pieChartData, sortBy]);

  if (loading) {
    return <p className="h3">Loading...</p>;
  }

  if (error) {
    return <p className="h3">{error}</p>;
  }

  return <Pie data={chartData} options={chartOptions} />;
}

function SalesCountNumber() {
  const [period, setPeriod] = useState<PeriodEnum>(PeriodEnum.DAILY);
  const [routeParam, setRouteParam] = useState<string>("sales-today");
  const [salesCount, setSalesCount] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSalesCount = async () => {
      try {
        setLoading(true);

        const insightResponse: AxiosResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/insights/${routeParam}`,
          {
            headers: {
              "branch-token": localStorage.getItem("branch-token"),
            },
            validateStatus: () => true,
          }
        );
        if (insightResponse?.status === 401) {
          localStorage.removeItem("branch-token");
          router.push("/branches");
          return;
        }
        if (insightResponse.status !== 200) {
          setError("Unable to fetch sales count");
          throw new Error("Unable to fetch sales count");
        }

        const responseBody = insightResponse.data;
        const { message, insight } = responseBody;

        setMessage(message);
        setSalesCount(insight);
      } catch (err) {
        setError("Failed to fetch sales count.");
        console.error("Error fetching sales count:", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchSalesCount();
  }, [routeParam]);

  return (
    <Container className="bg-white h-100 rounded-3 p-3 d-flex flex-column align-items-center justify-content-center">
      <ButtonGroup
        className="btn-group mb-3 w-100"
        role="group"
        aria-label="Time period"
      >
        <Button
          variant={period === PeriodEnum.DAILY ? "primary" : "outline-primary"}
          onClick={() => {
            setPeriod(PeriodEnum.DAILY);
            setRouteParam("sales-today");
          }}
        >
          {PeriodEnum.DAILY}
        </Button>
        <Button
          variant={period === PeriodEnum.WEEKLY ? "primary" : "outline-primary"}
          onClick={() => {
            setPeriod(PeriodEnum.WEEKLY);
            setRouteParam("sales-this-week");
          }}
        >
          {PeriodEnum.WEEKLY}
        </Button>
        <Button
          variant={
            period === PeriodEnum.MONTHLY ? "primary" : "outline-primary"
          }
          onClick={() => {
            setPeriod(PeriodEnum.MONTHLY);
            setRouteParam("sales-this-month");
          }}
        >
          {PeriodEnum.MONTHLY}
        </Button>
      </ButtonGroup>
      <Container className="bg-danger text-white h-100 rounded-2 p-3 m-2 d-flex flex-column align-items-center justify-content-center">
        <p className="h2">{`${period} sales count`}</p>
        {loading ? (
          <p className="h3">Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <p className="fs-1 fw-bold">{salesCount}</p>
        )}
      </Container>
    </Container>
  );
}

function SalesByPeriodChart() {
  const [period, setPeriod] = useState<PeriodEnum>(PeriodEnum.WEEKLY);

  return (
    <Container className="bg-white h-100 rounded-3 p-3 d-flex flex-column">
      <ButtonGroup
        className="btn-group mb-3 w-100"
        role="group"
        aria-label="Time period"
      >
        <Button
          variant={period === PeriodEnum.WEEKLY ? "primary" : "outline-primary"}
          onClick={() => setPeriod(PeriodEnum.WEEKLY)}
        >
          {PeriodEnum.WEEKLY}
        </Button>
        <Button
          variant={
            period === PeriodEnum.MONTHLY ? "primary" : "outline-primary"
          }
          onClick={() => setPeriod(PeriodEnum.MONTHLY)}
        >
          {PeriodEnum.MONTHLY}
        </Button>
        <Button
          variant={period === PeriodEnum.ANNUAL ? "primary" : "outline-primary"}
          onClick={() => setPeriod(PeriodEnum.ANNUAL)}
        >
          {PeriodEnum.ANNUAL}
        </Button>
      </ButtonGroup>
      <Container className="flex-grow-1" style={{ position: "relative" }}>
        {(period === PeriodEnum.WEEKLY || period === PeriodEnum.MONTHLY) && (
          <LineChartSales
            lineChartData={lineChartData}
            lineChartOptions={{
              ...lineChartOptions,
              maintainAspectRatio: false,
              responsive: true,
            }}
            period={period}
          />
        )}
        {period === PeriodEnum.ANNUAL && (
          <BarChartSales barChartData={barChartData} />
        )}
      </Container>
    </Container>
  );
}

interface LineChartSalesProps {
  lineChartData: ChartData<"line">;
  lineChartOptions: ChartOptions<"line">;
  period: PeriodEnum;
}
function LineChartSales({
  lineChartData,
  lineChartOptions,
  period,
}: LineChartSalesProps) {
  const [chartData, setChartData] = useState(lineChartData);
  const [chartOptions, setChartOptions] = useState(lineChartOptions);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);

        let url: string = "";
        let chartTitle: string = "";
        switch (period) {
          case PeriodEnum.WEEKLY:
            url = `${process.env.NEXT_PUBLIC_SERVER_URL}/insights/sales-in-week`;
            chartTitle = "Sales in This Week";
            break;
          case PeriodEnum.MONTHLY:
            url = `${process.env.NEXT_PUBLIC_SERVER_URL}/insights/sales-in-month`;
            chartTitle = "Sales in This Month";
            break;
          default:
            break;
        }
        const insightResponse: AxiosResponse = await axios.get(url, {
          headers: {
            "branch-token": localStorage.getItem("branch-token"),
          },
          validateStatus: () => true,
        });
        if (insightResponse?.status === 401) {
          localStorage.removeItem("branch-token");
          router.push("/branches");
          return;
        }
        if (insightResponse.status !== 200) {
          setError("Unable to fetch sales data");
          throw new Error("Unable to fetch sales data");
        }

        const responseBody: ResponseForLineChart = insightResponse.data;
        const { message } = responseBody;
        const { labels, data } = responseBody.insight;
        setChartData({
          ...lineChartData,
          labels: labels,
          datasets: [
            {
              ...lineChartData.datasets[0],
              data: data,
            },
          ],
        });
        setChartOptions({
          ...lineChartOptions,
          plugins: {
            ...lineChartOptions.plugins,
            title: {
              ...lineChartOptions.plugins?.title,
              text: chartTitle,
            },
          },
          scales: {
            ...lineChartOptions.scales,
            x: {
              title: {
                ...lineChartOptions.scales?.x?.title,
                text: `${
                  period === PeriodEnum.WEEKLY
                    ? "Days of week"
                    : period === PeriodEnum.MONTHLY
                      ? "Days of month"
                      : "Days of week/month"
                }`,
              },
            },
          },
        });
        console.log(`Fetched ${period} sales data: `, message);
      } catch (err) {
        setError("Failed to fetch sales by period.");
        console.error("Error fetching sales by period:", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchSalesData();
  }, [period, lineChartData, lineChartOptions]);

  if (loading) {
    return <p className="h3">Loading...</p>;
  }

  if (error) {
    return <p className="h3">{error}</p>;
  }

  return <Line data={chartData} options={chartOptions} />;
}

interface BarChartSalesProps {
  barChartData: ChartData<"bar">;
}
function BarChartSales({ barChartData }: BarChartSalesProps) {
  const [chartData, setChartData] = useState(barChartData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);

        const insightResponse: AxiosResponse<ResponseForBarChart> =
          await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/insights/sales-in-year`,
            {
              headers: {
                "branch-token": localStorage.getItem("branch-token"),
              },
              validateStatus: () => true,
            }
          );
        if (insightResponse?.status === 401) {
          localStorage.removeItem("branch-token");
          router.push("/branches");
          return;
        }
        if (insightResponse.status !== 200) {
          setError("Unable to fetch sales data");
          throw new Error("Unable to fetch sales data");
        }

        const responseBody = insightResponse.data;
        const { message, insight } = responseBody;

        // Since datasets are modified inside the map, we need to be careful with typing
        setChartData((prevChartData) => {
          const updatedDatasets = prevChartData.datasets.map((dataset) => {
            const matchedInsightEntry = insight.find(
              (entry: CategoricalSales) =>
                entry.label?.toLowerCase() ===
                (dataset.label ?? "").toLowerCase()
            );

            if (matchedInsightEntry) {
              return { ...dataset, data: matchedInsightEntry.data };
            }
            return dataset;
          });

          return {
            ...prevChartData,
            datasets: updatedDatasets as ChartDataset<"bar">[],
          };
        });

        console.log(`Fetched annual sales data: `, message);
      } catch (err) {
        setError("Failed to fetch sales by period.");
        console.error("Error fetching sales by period:", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchSalesData();
  }, [barChartData, router]);

  if (loading) {
    return <p className="h3">Loading...</p>;
  }

  if (error) {
    return <p className="h3">{error}</p>;
  }

  return (
    <Bar
      data={chartData}
      options={{
        ...barChartOptions,
        maintainAspectRatio: false,
        responsive: true,
      }}
    />
  );
}
