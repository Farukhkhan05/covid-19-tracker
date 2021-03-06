import React, { useEffect, useState } from 'react';
import{FormControl,Select,MenuItem, Card, CardContent} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import './App.css';
import Table from './Table';

function App() {
  const [countries, setcountries] = useState([]);
  const [country, setcountry] = useState('Worldwide');
  const [countryInfo, setcountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/all').then((response)=> response.json()).then((data)=>{
      setcountryInfo(data);
    });
  },[]);

  useEffect(()=>{
    const getCountriesData = async() =>{
      await fetch('https://disease.sh/v3/covid-19/countries').then((response)=>response.json()).then((data)=>{
        const countries = data.map((country)=>({
          name: country.country,
          value: country.countryInfo.iso2,
        }));
        setcountries(countries);
        setTableData(data);
      })
    }
    getCountriesData();
  },[]);

  const  onCountryChange = async (event)=>{
    const countryCode = event.target.value;
    console.log('Yooo >>>',countryCode);
    setcountry(countryCode);

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url).then(response=>response.json()).then(data=>{
      setcountry(countryCode);
      setcountryInfo(data);

    })
  }
  console.log('countryInfo >>>', countryInfo)
  
  return(
    <>
      <div className='app'>
        <div className='app__left'>
        <div className='app__header'>
          <h1>COVID-19 TRACKER</h1>
          <FormControl className='app__dropdown'>
            <Select variant='outlined' onChange={onCountryChange} value={country}>
            <MenuItem value='worldwide'>Worldwide</MenuItem>
            {countries.map((country)=>(
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
            </Select>
          </FormControl>
        </div>
         
         <div className='app__stats'>
           <InfoBox title='Coronavirus Cases' cases={countryInfo.todayCases} total={countryInfo.cases}/>
           <InfoBox title='Recovered' cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
           <InfoBox title='Deaths' cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
         </div>
         <Map/>
        </div>
        <Card className='app__right'>
          <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData}/>
            <h3>Worldwide new cases</h3>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default App;
