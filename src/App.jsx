import {  useEffect, useRef, useState, useCallback } from 'react'
import search from './assets/search.png'
import humidity from './assets/humidity.png'
import wind from './assets/wind.png'
import temp from './assets/temp2.png'
import './App.css'

function App() {

  const [weatherdata,setWeatherdata] = useState()
  const [city,setCity] = useState("");
  const [logo,setLogo] = useState("")
  const [loading,setLoading] = useState("")
  const apiurl = "https://api.weatherapi.com/v1/forecast.json"
  const apikey = "?key=80b9e405f4ac4ad78fc131946240705"
  const parameter = "&days=5&aqi=no&alerts=yes"
  const [loader,setLoader] = useState(false)
  const [load,setLoad] = useState(false)
  const [forecast,setForecast] = useState([])
  // const [report,setReport] = useState(false)
  const contentref = useRef(null);

  // const [hdata,setHdata] = useState([])

function debounce(cb,delay=1000){
  let timer;
  return (...args)=>{
    clearTimeout(timer);
    timer = setTimeout(()=>{
       cb(...args)
    },delay)
  }
}

const debouncedHandleInput = useCallback(
  debounce((e) => {
    setCity(e.target.value);
  }, 1000),
  []
);
  const handlebtn = ()=>{
      setLogo('logo')
      setLoader(true)
      setTimeout(()=>{
        setLoading('heading')
      },1000)
      
    fetch(apiurl+apikey+`&q=${city}`+parameter)
      .then(res=>{
        return res.json()
      })
      .then(data=>{
        let datas = data
        
        setTimeout(()=>{
          setLoad(true)
          setWeatherdata(datas)
          setForecast(datas.forecast.forecastday)
        },1000)
      
        setTimeout(()=>{
          setLoad(false)
          setCity("")
        },5000)

      
  })
      
}

useEffect(() => {
  if (weatherdata?.current?.feelslike_c > 30 && contentref.current) {
    contentref.current.style.background = 'red';
  }
  else if(weatherdata?.current?.feelslike_c < 25 && contentref.current){
    contentref.current.style.background = 'orange';
  }
   else if (contentref.current) {
    contentref.current.style.background = ''; // Reset or default
  }
}, [weatherdata]);


 console.log(weatherdata)
 console.log(forecast)
//  console.log(typeof weatherdata.current.feelslike_c)
  
  
 
  // console.log(hdata)
  return (

    <div className="app">
    <div ref={contentref} className="container">
      
      <div className="search">
        <input value={city} placeholder='Enter City Name' onChange={debouncedHandleInput} type='text'/>
         <button onClick={handlebtn}><img src={search}></img></button>
      </div>
     {loader &&  <div className={logo} ><h2 className={loading}>Loading...</h2>{load && <h2>Loaded</h2>}</div>}
       
      {weatherdata &&
      
       <div className='weather'>
        
       
          <h3>Current Weather <span>{weatherdata.location.name}</span>, {weatherdata.location.region}, {weatherdata.location.country}</h3>
          <div className="condition">
           <div className="condition-1">
             <p>{weatherdata.current.condition.text}</p>
             <img className='w-img' src={weatherdata.current.condition.icon} alt="" />
           </div>
          <div className="condition-2">
             <p>{weatherdata.current.humidity} % <span>Humidity</span></p>
             <img className='h-img' src={humidity}/>
          </div>
          <div className="wind-data">
            <p>Wind Speed {weatherdata.current.wind_kph} Kmph</p>
            <img src={wind} />
          </div>
          <div className="temp">
            <p>{weatherdata.current.feelslike_c} °C / {weatherdata.current.temp_c} °C</p>
            <img src={temp} alt="" />
          </div>
          </div>
        </div>}
        {report && <h2>3 Days Weather Report</h2>}
       <div className="forecast-container">
         {forecast && forecast.map((data,index)=>{
          return (
            <div key={index} className="forecast">
           
             <div className="data">
              <img src={data.day.condition.icon} alt="" />
             <p>{data.day.condition.text}</p>
             <p>{data.date}</p>
             <p>MAX {data.day.maxtemp_c} °C / MIN {data.day.mintemp_c} °C</p>
             </div>
              
            </div>
          )
        })}
       </div>



     </div>


      
     
      

    </div>
  )
}

export default App
