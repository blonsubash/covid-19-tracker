import React, { useEffect, useState } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  CardContent,
  Card,
} from "@mui/material";
import "leaflet/dist/leaflet.css";

import "./App.css";

import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import LineGraph from "./LineGraph";
import { prettyPrintStat, sortData } from "./util";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 28, lng: 84 });
  const [mapZoom, setMapZoom] = useState(5);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(5);
      });
  };

  useEffect(() => {
    const getCountiresData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountiresData();
  }, []);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              fullWidth
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            total={prettyPrintStat(countryInfo?.cases)}
            cases={prettyPrintStat(countryInfo?.todayCases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered Cases"
            total={prettyPrintStat(countryInfo?.recovered)}
            cases={prettyPrintStat(countryInfo?.todayRecovered)}
          />
          <InfoBox
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            total={prettyPrintStat(countryInfo?.deaths)}
            cases={prettyPrintStat(countryInfo?.todayDeaths)}
          />
        </div>
        <Map
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
          casesType={casesType}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
