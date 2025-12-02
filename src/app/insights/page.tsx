"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
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

import { barChartData, barChartOptions } from "../data/bar_chart.ts";
import { pieChartData, pieChartOptions } from "../data/pie_chart.ts";
import { lineChartData, lineChartOptions } from "../data/line_chart.ts";

import {
  ResponseForBarChart,
  ResponseForLineChart,
  ResponseForPieChart,
  CategoricalSales,
} from "../dtos/insight_dtos.ts";
import PeriodEnum from "../interfaces/period_enum.ts";

export default function InsightsPage() {
  return (
    <Container className="m-3 gap-2">
      <Row className="d-flex justify-content-between align-items-center">
        <Col>
          <TopMenusChart />
        </Col>
      </Row>
      <Row className="d-flex justify-content-between align-items-center">
        <Col>
          <SalesByPeriodChart />
        </Col>
      </Row>
    </Container>
  );
}

function TopMenusChart() {
  return (
    <Container>
      <PieChartSales
        pieChartData={pieChartData}
        pieChartOptions={pieChartOptions}
      />
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

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);

        const insightResponse: AxiosResponse = await axios.get(
          `http://localhost:8085/insights/top-menus`
        );
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
    <Container>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <Pie data={chartData} options={chartOptions} />
      )}
    </Container>
  );
}

function SalesByPeriodChart() {
  const [period, setPeriod] = useState<PeriodEnum>(PeriodEnum.WEEKLY);

  return (
    <Container>
      <Container
        className="btn-group mb-3"
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
      </Container>
      {period === PeriodEnum.WEEKLY || period === PeriodEnum.MONTHLY ? (
        <LineChartSales
          lineChartData={lineChartData}
          lineChartOptions={lineChartOptions}
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

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);

        let url: string = "";
        let chartTitle: string = "";
        switch (period) {
          case PeriodEnum.WEEKLY:
            url = `http://localhost:8085/insights/sales-in-week`;
            chartTitle = "Sales in This Week";
            break;
          case PeriodEnum.MONTHLY:
            url = `http://localhost:8085/insights/sales-in-month`;
            chartTitle = "Sales in This Month";
            break;
          default:
            break;
        }
        const insightResponse: AxiosResponse = await axios.get(url);
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
                text: `${period === PeriodEnum.WEEKLY
                ? "Days of week" : period === PeriodEnum.MONTHLY
                ? "Days of month" : "Days of week/month"}`,
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
    <Container>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <Line data={chartData} options={chartOptions} />
      )}
    </Container>
  );
}

interface BarChartSalesProps {
  barChartData: ChartData<"bar">;
}
function BarChartSales({ barChartData }: BarChartSalesProps) {
  const [chartData, setChartData] = useState(barChartData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);

        const insightResponse: AxiosResponse = await axios.get(
          `http://localhost:8085/insights/sales-in-year`
        );
        if (insightResponse.status !== 200) {
          setError("Unable to fetch sales data");
          throw new Error("Unable to fetch sales data");
        }

        const responseBody: ResponseForBarChart = insightResponse.data;
        const { message, insight } = responseBody;

        const updatedDatasets: ChartDataset<
          "bar",
          (number | [number, number] | null)[]
        >[] = chartData.datasets.map((dataset: ChartDataset<"bar">) => {
          const matchedInsightEntry = insight.find(
            (entry: CategoricalSales) => entry.label === dataset.label?.toLowerCase()
          );
          if (matchedInsightEntry) {
            return {
              ...dataset,
              data: matchedInsightEntry.data,
            } as ChartDataset<"bar", (number | [number, number] | null)[]>;
          }
          return dataset as ChartDataset<
            "bar",
            (number | [number, number] | null)[]
          >;
        });
        setChartData({
          ...chartData,
          datasets: updatedDatasets,
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
  }, [barChartData]);

  return (
    <Container>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <Bar data={chartData} options={barChartOptions} />
      )}
    </Container>
  );
}
