CREATE EXTERNAL TABLE IF NOT EXISTS MathJump.attempts (
  `appinstanceid` string,
  `attemptid` string,
  `questionid` string,
  `questiontimestamp` timestamp,
  `questiontimestamputc` timestamp,
  `questionyear` int,
  `questionmonth` int,
  `questionday` int,
  `questionhour` int,
  `questionminute` int,
  `questionsecond` int,
  `playerid` string,
  `playerlevel` int,
  `level` int,
  `operation` string,
  `number` int,
  `questiontype` string,
  `config` string,
  `text` string,
  `correctanswer` int,
  `attempttimestamp` timestamp,
  `attempttimestamputc` timestamp,
  `attemptyear` int,
  `attemptmonth` int,
  `attemptday` int,
  `attempthour` int,
  `attemptminute` int,
  `attemptsecond` int,
  `attemptanswer` int,
  `correct` boolean 
)
PARTITIONED BY (
  `year` int,
  `month` int,
  `day` int
)
ROW FORMAT SERDE 'org.openx.data.jsonserde.JsonSerDe'
WITH SERDEPROPERTIES (
  "paths"="year,month,day"
) LOCATION 's3://1337coders/analytics/MathJump/attempts/'
TBLPROPERTIES (
  'has_encrypted_data'='false'
);

MSCK REPAIR TABLE MathJump.attempts;