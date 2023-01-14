import './App.css';
import React, { useState,useEffect,useRef } from 'react';
import { useCountdown } from './hooks/useCountdown';

function App() {

  const [minutesCount,setMinutesCount] = useState(25);//Conteo Global de minutos
  const timeRangeInMs = minutesCount * 60 * 1000;//Minutos en milisegundos

  const [playPause,setPlayPause] = useState(false);//Pausar o iniciar el conteo Global

  const [sessionOrBrakeChangeLength,setSessionOrBrakeChangeLength] = useState(false);//Permite que el conteo global muestre el cambio de la nueva longitud de la session o brake (dependiendo si esta en periodo de session o brake)

  const [breakTime,setBreakTime] = useState(false);//Periodo de session (false) ó periodo de break (true)

  const [breakLengthMinutes,setbreakLengthMinutes] = useState(5);//Longitud del Brake
  const [sessionLengthMinutes,setSessionLengthMinutes] = useState(25);//Longitud del Session



  return (
    <div className="main-div">
      <h1 className='title'>Pomodoro Clock</h1>
      <Break setMinutes={setMinutesCount} setSessionOrBrakeChangeLength={setSessionOrBrakeChangeLength} playPause={playPause} breakTime={breakTime} breakLengthMinutes={breakLengthMinutes} setbreakLengthMinutes={setbreakLengthMinutes} />

      <Session setMinutes={setMinutesCount} setSessionOrBrakeChangeLength={setSessionOrBrakeChangeLength} playPause={playPause} breakTime={breakTime} sessionLengthMinutes={sessionLengthMinutes} setSessionLengthMinutes={setSessionLengthMinutes}/>

      <TimeDisplay timeRangeInMs={timeRangeInMs} sessionOrBrakeChangeLength={sessionOrBrakeChangeLength} setSessionOrBrakeChangeLength={setSessionOrBrakeChangeLength} playPause={playPause} setPlayPause={setPlayPause} breakTime={breakTime} setBreakTime={setBreakTime} setMinutesCount={setMinutesCount} breakLengthMinutes={breakLengthMinutes} setbreakLengthMinutes={setbreakLengthMinutes} sessionLengthMinutes={sessionLengthMinutes} setSessionLengthMinutes={setSessionLengthMinutes}/>
    </div>
  );
}


const Break = ({setMinutes,playPause,breakTime,setSessionOrBrakeChangeLength,breakLengthMinutes,setbreakLengthMinutes}) =>{
  
  const handleChange = (upOrDown) =>{
    if(upOrDown==="Up" && playPause===false && breakLengthMinutes<60){
      setbreakLengthMinutes(breakLengthMinutes+1);
      if(breakTime===true){
        setMinutes(minutes=>minutes+1);
        setSessionOrBrakeChangeLength(true);
      }
    }
    else if(upOrDown==="Down" && playPause===false && breakLengthMinutes>1){
      setbreakLengthMinutes(breakLengthMinutes-1);
      if(breakTime===true){
        setMinutes(minutes=>minutes-1);
        setSessionOrBrakeChangeLength(true);
      }
    }
  }

  return (
    <div className="breaksessionlength">
      <h2 id="break-label">Break Length</h2>
      <h2 id="break-length">{breakLengthMinutes}</h2>
      <button id="break-decrement" onClick={()=>handleChange("Down")}>Down</button>
      <button id="break-increment" onClick={()=>handleChange("Up")}>Up</button>
    </div>
  );
}


const Session = ({setMinutes,setSessionOrBrakeChangeLength,playPause,breakTime,sessionLengthMinutes,setSessionLengthMinutes}) =>{
  
  const handleChange = (upOrDown) =>{
    if(upOrDown==="Up"&&playPause===false && sessionLengthMinutes<60){
      setSessionLengthMinutes(sessionLengthMinutes+1);
      if(breakTime===false){
        setMinutes(minutes=>minutes+1);
        setSessionOrBrakeChangeLength(true);
      }
    }
    else if(upOrDown==="Down"&&playPause===false&&sessionLengthMinutes>1){
      setSessionLengthMinutes(sessionLengthMinutes-1)
      if(breakTime===false){
        setMinutes(minutes=>minutes-1);
        setSessionOrBrakeChangeLength(true);
      }
    }
  }

  return (
    <div className="breaksessionlength">
      <h2 id="session-label">Session Length</h2>
      <h2 id="session-length">{sessionLengthMinutes}</h2>
      <button id="session-decrement" onClick={()=>handleChange("Down")}>Down</button>
      <button id="session-increment" onClick={()=>handleChange("Up")}>Up</button>
    </div>
  );
}
 
const TimeDisplay = ({timeRangeInMs,playPause,setPlayPause,sessionOrBrakeChangeLength,setSessionOrBrakeChangeLength,breakTime,setBreakTime,setMinutesCount,breakLengthMinutes,setbreakLengthMinutes,sessionLengthMinutes,setSessionLengthMinutes}) =>{

  const [sessionOrBreakChange,setSessionOrBrakeChange] = useState(false);//Se activa solo cuando el contador Global llega a 00:00 , activando cambio a break o session
  const [timeOutFunc,setTimeOutFuc] = useState({});//Para poder almacenar a setTimeOut y llamar a clear en el resetFunc
  const objAlarmAudio = useRef(null);//Objeto html5 audio

  const [minutes, seconds] = useCountdown(timeRangeInMs,playPause,setPlayPause,sessionOrBrakeChangeLength,setSessionOrBrakeChangeLength,sessionOrBreakChange,setSessionOrBrakeChange);//Custom Hook para manejar el conteo regresivo a tiempo real...

  useEffect(()=>{
    if(minutes==="0"&&seconds==="0"){
      setPlayPause(false);
      objAlarmAudio.current.play();
      const timerOut = setTimeout(() => {
        setBreakTime(!breakTime);
        setSessionOrBrakeChange(true);
        if(breakTime===false){//Contraintuitivo porque aun en el scope no se ha actualizado la variable breaktime 
        setMinutesCount(breakLengthMinutes);
        }
        else if(breakTime===true){
        setMinutesCount(sessionLengthMinutes);
        }
      },1000);
      setTimeOutFuc(timerOut);

    }
    // eslint-disable-next-line
  },[minutes,seconds])
  

  const startStopFunc = () =>{
    setPlayPause(!playPause);
  }
  const resetFunc = () =>{
    clearInterval(timeOutFunc);
    setPlayPause(false);
    setBreakTime(false);
    objAlarmAudio.current.load();
    setSessionOrBrakeChange(false)
    setSessionLengthMinutes(25);
    setbreakLengthMinutes(5);
    setMinutesCount(25)
    setSessionOrBrakeChangeLength(true);
  }

  return (
    <div>
      <h2 id="timer-label">{breakTime?"Break":"Session"}</h2>
      <h1 id="time-left">{minutes.padStart(2,"0")}:{seconds.padStart(2,"0")}</h1>
      <button id="start_stop" onClick={startStopFunc}>Start / Stop</button>
      <button id="reset" onClick={resetFunc} >Reset</button>
      <audio ref={objAlarmAudio} id="beep" src='https://www.fesliyanstudios.com/play-mp3/4387'></audio>
    </div>
  );
}



export default App;
