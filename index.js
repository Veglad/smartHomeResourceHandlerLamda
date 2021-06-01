'use strict';

console.log('Loading function');

const { Client } = require('@elastic/elasticsearch');

const indexNames = {
    AIR_QUALITY_METER: "air-quality-meter",
    ELECTRICITY_METER: "electricity-meter",
    WATER_METER: "water-meter",
};

exports.handler = async event => {
    console.log('Received in lambda event:', JSON.stringify(event, null, 2));

    const client = new Client({
        auth: {
            username: 'rek0ra921',
            password: '12344321Dad$'
        },
        node: 'https://search-khai-smart-home-resources-i5ebcgl5f4evbaj5hwuya7hx3e.us-east-2.es.amazonaws.com',
    });

    // Validate params
    if (!event || !event.state || !event.state.reported) {
        console.log('Inbound event has incorrect format. Should contain state.reported object');
        console.log(event);

        return {
            statusCode: 400,
            error: "state.reported was not provided"
        };
    }

    const smartHomeResourceLog = event.state.reported;

    const airQualityMeter = smartHomeResourceLog.air_quality_meter
    const electricityMeter = smartHomeResourceLog.electricity_meter
    const waterMeter = smartHomeResourceLog.water_meter
    const timestamp = smartHomeResourceLog.timestamp

    if (!airQualityMeter || !electricityMeter || !waterMeter || !timestamp) {
        console.log('Some or several of required fields where null [air_quality_meter, electricity_meter, water_meter, timestamp]');
        return {
            statusCode: 400,
            error: "Some or several of required fields where null [air_quality_meter, electricity_meter, water_meter, timestamp]"
        };
    }

    // Indexing data
    await indexDataInElasticSearch(client, indexNames.AIR_QUALITY_METER, { value: airQualityMeter, timestamp }),
    await indexDataInElasticSearch(client, indexNames.ELECTRICITY_METER, { value: electricityMeter, timestamp }),
    await indexDataInElasticSearch(client, indexNames.WATER_METER, { value: waterMeter, timestamp })

    return { statusCode: 200 }
};

const indexDataInElasticSearch = (elasticClient, indexName, body) => {
    console.log(`Indexing smart home resources log for index: ${indexName}*`)

    return elasticClient.index({ index: indexName, body })
        .then(response => console.log(response))
        .catch(error => {
            console.error('ElasticSearch error: ')
            console.error(error)
        })
}
