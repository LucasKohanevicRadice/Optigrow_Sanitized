import {
  PlaceTwoTone,
  Place,
  WaterDrop,
  ThermostatTwoTone,
  PriorityHigh,
  ElectricBolt,
  Science,
} from "@mui/icons-material";
import _ from "lodash";

const sensorTabsContent = (growEnvironment) => {
  const history = (growEnvironment.sensorReadingHistory || []).map((d) => ({
    ...d,
    dateTime: new Date(d.dateTime),
  }));
  return [
    {
      id: "humidity",
      dataKey: "humidity",
      label: "Humidity %",
      icon: WaterDrop,
      value: _.last(history)?.humidity,
      unit: "%",
      data: history,
      range: growEnvironment.optimalRanges.humidity,
    },
    {
      id: "ph",
      dataKey: "ph",
      label: "pH Level",
      icon: Science,
      value: _.last(history)?.ph,
      unit: "",
      data: history,
      range: growEnvironment.optimalRanges.ph,
    },
    {
      id: "ec",
      dataKey: "ec",
      label: "EC Level",
      icon: ElectricBolt,
      value: _.last(history)?.ec,
      unit: " mS/cm",
      data: history,
      range: growEnvironment.optimalRanges.ec,
    },
    {
      id: "temperature",
      dataKey: "temperature",
      label: "Temperature",
      icon: ThermostatTwoTone,
      value: _.last(history)?.temperature,
      unit: "°C",
      data: history,
      range: growEnvironment.optimalRanges.temperature,
    },
  ];
};

export default sensorTabsContent;
