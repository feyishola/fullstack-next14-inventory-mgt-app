import React from "react";
import Card from "../components/dashboard/card/card";
import Rightbar from "../components/dashboard/rightbar/rightbar";
import Transactions from "../components/dashboard/transactions/transactions";
import Chart from "../components/dashboard/chart/chart";

//Dummy Data
const item = {
  title: "Daily Stats Card",
  number: 1000,
  details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  change: 50,
};

const item1 = {
  title: "Weekly Stats Card",
  number: 5000,
  details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  change: -50,
};

const Dashboard = () => {
  return (
    <div className="wrap flex gap-5 mt-5">
      <div className="main w-[70%] flex flex-col gap-5">
        <div className="cards flex gap-5 justify-between">
          <Card item={item} />
          <Card item={item1} />
          <Card item={item} />
        </div>
        <Transactions />
        <Chart />
      </div>
      <div className="side w-[30%]">
        <Rightbar />
      </div>
    </div>
  );
};

export default Dashboard;
