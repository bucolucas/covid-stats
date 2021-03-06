const fetch = require("node-fetch");
const CONFIRMED_GLOBAL_URL = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
const Papa = require('papaparse');

const getCsv = async (url) => {
  const response = await fetch(url);
  const text = await response.text();
  const csv = Papa.parse(text, { header: true }).data;
  return csv;
};

const formatCsv = csv => {
  const today = getToday();
  const yesterday = getYesterday();
  const weekAgo = getWeekAgo();
  return csv.map(row => ({
    country: row['Country/Region'],
    [today]: row[today],
    [yesterday]: row[yesterday],
    [weekAgo]: row[weekAgo],
  }));
}

const processUrl = async (url) => {
  const csv = await getCsv(url);
  const formatted = formatCsv(csv);
  console.dir(formatted);
}

const getToday = () => {
  return formatDate(new Date());
}

const getYesterday = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1)
  return formatDate(yesterday);
}

const getWeekAgo = () => {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 1)
  return formatDate(weekAgo);
}

const formatDate = date => {
  var d = String(date.getDate());
  var m = String(date.getMonth() + 1); //January is 0!
  var yy = date.getFullYear().toString().substr(-2);
  return m + '/' + d + '/' + yy;
}

processUrl(CONFIRMED_GLOBAL_URL);
