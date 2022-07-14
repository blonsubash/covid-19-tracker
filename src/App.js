import React, { useEffect, useState } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  CardContent,
  Card,
} from "@mui/material";

import "./App.css";

import InfoBox from "./InfoBox";
import Map from "./Map";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");

  useEffect(() => {
    const getCountiresData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          setCountries(countries);
        });
    };
    getCountiresData();
  }, []);
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    console.log("code", countryCode);
    setCountry(countryCode);
  };
  console.log(countries);
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
          <InfoBox title="Coronavirus Cases" total={2000} cases={123} />
          <InfoBox title="Recovered Cases" total={3000} cases={123} />
          <InfoBox title="Deaths" total={100} cases={123} />
        </div>
        <Map />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
