import { useState , useEffect } from 'react';

const useCountdown = (timeRangeInMs,play,setPlay,sessionOrBreakChangeLength,setSessionOrBreakChangeLength,sessionOrBreakChange,setSessionOrBrakeChange) => {


    const [countDown, setCountDown] = useState(timeRangeInMs+999);//Conteo Global a tiempo real en ms

    useEffect(() => {
      let interval;
      
      if(sessionOrBreakChangeLength){//Solo se activa 1 vez (cuando se da click a Up o Down)
        setCountDown(timeRangeInMs+999);//Cambio de longitud de tiempo en el CG
        setSessionOrBreakChangeLength(false);
      }
      else if(sessionOrBreakChange){//Solo se activa  1 vez (un segundo despues de que el conteo llegue a 00:00)
        setCountDown(timeRangeInMs+999);
        setPlay(true);
        setSessionOrBrakeChange(false);
      }
      else if(play){//Conteo en tiempo real
        let countDownDate = countDown + new Date().getTime();
        interval = setInterval(() => {
          setCountDown(countDownDate - new Date().getTime());
        }, 1000);
      
      }
      else {

      }
      
      return () => clearInterval(interval);
      // eslint-disable-next-line
    }, [play,sessionOrBreakChangeLength,sessionOrBreakChange]);
    return getReturnValues(countDown);
  };
  
  

  const getReturnValues = (countDown) => {
    //const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000;Referencia mía (3 días)
    let minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((countDown % (1000 * 60)) / 1000);


    if(countDown>=3600000){
      minutes=60;
     }
  
    return [minutes.toString(), seconds.toString()];
  };
  
  export { useCountdown };