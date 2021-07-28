import React,{useState,useEffect} from "react";
import './App.css';
import {FormControl,Select,MenuItem,Card,CardContent,Typography} from "@material-ui/core";
import InfoBox from"./InfoBox";
import Map from "./Map";
import Table from "./Table";
import {sortData} from "./util";
import LineGraph from "./LineGraph";

function App() {

  const [countries,setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo,setCountryInfo] = useState("");
  const [tableData,setTableData] = useState([]);
  const [casesType,setCasesType] = useState();


  //https://disease.sh/v3/covid-19/countries
//initial ly show the corona details
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all").then(response => response.json()).then(data =>{
      setCountryInfo(data)
    })
  }, [])

  useEffect(() => {
    const getCountriesData = async() => {
      await fetch("https://disease.sh/v3/covid-19/countries").then((response)=>response.json()).then((data)=>{
        const countries = data.map((country)=>(
          {
            name:country.country,
            value:country.countryInfo.iso2
          }
        ));
        setCountries(countries);
        let sortedData = sortData(data); //this acending the count
        setTableData(sortedData);
      })
    };
    getCountriesData();
  }, [])

  
  const countryChange = async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);
    
    const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url).then(response => response.json()).then((data)=>{
      setCountry(countryCode);

      //all the data from the countryb respopnse
      setTableData(data)
    });
  };
  //console.log("CountryInfo",countryInfo)
  //console.log(countries)
  return (
    <div className="app">
        <div className="app__left">
          <div className="app__header">
            <h1>Covid-19 Tracker</h1>
            <FormControl className="app__dropdown">
              <Select varient = "outlined" onChange={countryChange} value={country}>
                <MenuItem value="worldwide">worldwide</MenuItem>
                {
                  countries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                 ))
                }
              </Select>
            </FormControl>
          </div>
          <div className="app__stats">
            <InfoBox title="Corona Virus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
            <InfoBox title="Recovered"  cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
            <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
          </div>
          <Map/>
        </div>
        <Card className="app__right">
          <CardContent>
            <h3>Live Cases By country</h3>
            <Table countries={tableData} />
            <h3>Worldwide New Cases</h3>
            <LineGraph casesType/>
          </CardContent>
        </Card>
    </div>
    
  );
}

export default App;
