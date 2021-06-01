// This is just code that is used in the iotify network template for generating smart house iot events
// Leaving it for history
{   
    const SMART_HOME_GW_NAME = 'SMART_HOME_GW_NAME'
    if (state[SMART_HOME_GW_NAME] === undefined ) {
        state[SMART_HOME_GW_NAME] = {
            air_quality_meter: 90,
            electricity_meter: 5500,
            water_meter: 35000
        };
    }
    
    const lastState = state[SMART_HOME_GW_NAME]
    
    const metricsScatter = {
        AIR_QUALITY_METER: { 
            FROM: -5,
            TO: 5,
        },
        ELECTRICITY_METER: { 
            FROM: 0,
            TO: 0.012,
        },
        WATER_METER: { 
            FROM: 0,
            TO: 0.12,
        },
    }
    
    const air_quality_meter = Math.max(0, lastState.air_quality_meter + chance.floating({
        min: metricsScatter.AIR_QUALITY_METER.FROM,
        max: metricsScatter.AIR_QUALITY_METER.TO
    }))
    const electricity_meter = lastState.electricity_meter + chance.floating({
        min: metricsScatter.ELECTRICITY_METER.FROM,
        max: metricsScatter.ELECTRICITY_METER.TO
    })
    const water_meter = lastState.water_meter + chance.floating({
        min: metricsScatter.WATER_METER.FROM,
        max: metricsScatter.WATER_METER.TO
    })
    
    
    state[SMART_HOME_GW_NAME] = {
        air_quality_meter,
	    electricity_meter,
	    water_meter,
	    timestamp: moment().format(),
    }
     
	var payload = {
	    state: {
	        reported: state[SMART_HOME_GW_NAME]
	    }
	}
    return JSON.stringify(payload);
}
