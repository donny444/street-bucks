"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import axios, { AxiosResponse } from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button } from "react-bootstrap";

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
    <Container className="bg-light p-3 h-100 d-flex flex-column" fluid>
      <Row className="flex-grow-1 h-50 mb-3">
        <Col md={6} className="h-100">
          <TopMenusChart />
        </Col>
        <Col md={6} className="h-100">
          <Container className="bg-white h-100 rounded-3 p-3">
            {/* Blank container for now */}
          </Container>
        </Col>
      </Row>
      <Row className="flex-grow-1 h-50">
        <Col className="h-100">
          <SalesByPeriodChart />
        </Col>
      </Row>
    </Container>
  );
}

function TopMenusChart() {
  return (
    <Container className="bg-white h-100 rounded-3 p-3 d-flex align-items-center justify-content-center">
      <div style={{ height: "100%", width: "100%", position: "relative" }}>
        <PieChartSales
          pieChartData={pieChartData}
          pieChartOptions={{
            ...pieChartOptions,
            maintainAspectRatio: false,
            responsive: true,
          }}
        />
      </div>
    </Container>
  );
}
interface PieChartSalesProps {
  pieChartData: ChartData<"pie">;
  pieChartOptions: ChartOptions<"pie">;
}
function PieChartSales({ pieChartData, pieChartOptions }: PieChartSalesProps) {
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
          `${process.env.NEXT_PUBLIC_SERVER_URL}/insights/top-menus`,
          {
            headers: {
              "branch-token": localStorage.getItem("branch-token"),
            },
          }
        );
        if (insightResponse?.status === 401) {
          localStorage.removeItem("branch-token");
          router.push("/branches");
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
              data,
            },
          ],
        });
        console.log(`Fetched top menus sold: `, message);
      } catch (err) {
        setError("Failed to fetch top menus sold.");
        console.error("Error fetching top menus sold:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [pieChartData]);

  return (
    <>
      {loading ? (
        <p className="h3">Loading...</p>
      ) : error ? (
        <p className="h3">{error}</p>
      ) : (
        <Pie data={chartData} options={chartOptions} />
      )}
    </>
  );
}

function SalesByPeriodChart() {
  const [period, setPeriod] = useState<PeriodEnum>(PeriodEnum.WEEKLY);

  return (
    <Container className="bg-white h-100 rounded-3 p-3 d-flex flex-column">
      <div
        className="btn-group mb-3 align-self-start"
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
      </div>
      <div className="flex-grow-1" style={{ position: "relative" }}>
        {period === PeriodEnum.WEEKLY || period === PeriodEnum.MONTHLY ? (
          <LineChartSales
            lineChartData={lineChartData}
            lineChartOptions={{
               ...lineChartOptions,
               maintainAspectRatio: false,
               responsive: true
           }}
            period={period}
          />
        ) : (
          <></>
        )}
        {period === PeriodEnum.ANNUAL ? (
          <BarChartSales barChartData={barChartData} />
        ) : (
          <></>
        )}
      </div>
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
        });
        if (insightResponse?.status === 401) {
          localStorage.removeItem("branch-token");
          router.push("/branches");
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

    fetchSalesData();
  }, [period, lineChartData, lineChartOptions]);

  return (
    <>
      {loading ? (
        <p className="h3">Loading...</p>
      ) : error ? (
        <p className="h3">{error}</p>
      ) : (
        <Line data={chartData} options={chartOptions} />
      )}
    </>
  );
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

        const insightResponse: AxiosResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/insights/sales-in-year`,
          {
            headers: {
              "branch-token": localStorage.getItem("branch-token"),
            },
          }
        );
        if (insightResponse?.status === 401) {
          localStorage.removeItem("branch-token");
          router.push("/branches");
        }
        if (insightResponse.status !== 200) {
          setError("Unable to fetch sales data");
          throw new Error("Unable to fetch sales data");
        }

        const responseBody: ResponseForBarChart = insightResponse.data;
        const { message, insight } = responseBody;

        // Since datasets are modified inside the map, we need to be careful with typing
        const updatedDatasets = chartData.datasets.map((dataset) => {
             const matchedInsightEntry = insight.find(
                (entry: CategoricalSales) =>
                  entry.label === dataset.label?.toLowerCase()
              );

              if (matchedInsightEntry) {
                 return { ...dataset, data: matchedInsightEntry.data };
              }
              return dataset;
        });

        setChartData({
          ...chartData,
          datasets: updatedDatasets as any, // Type assertion to avoid complexity with chart.js union types
        });

        console.log(`Fetched annual sales data: `, message);
      } catch (err) {
        setError("Failed to fetch sales by period.");
        console.error("Error fetching sales by period:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [barChartData]); // Depend on barChartData, usually static from props

  return (
    <>
      {loading ? (
        <p className="h3">Loading...</p>
      ) : error ? (
        <p className="h3">{error}</p>
      ) : (
        <Bar data={chartData} options={{...barChartOptions, maintainAspectRatio: false, responsive: true}} />
      )}
    </>
  );
}
