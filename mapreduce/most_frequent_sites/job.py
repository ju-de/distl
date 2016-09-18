# these two lines bring in a variable 'sc' to imitate the PySpark shell
from pyspark import SparkContext
import os
import datetime

sc = SparkContext('local', 'logistic')

#'gs://distl-logs/<year>/<month>/<day>'
date = datetime.datetime.now() - datetime.timedelta(days=1)
year, month, day = str(date.year), str(date.month), str(date.day)
if len(month) == 1:
    month = '0' + month
if len(day) == 1:
    day = '0' + day

log_directory = 'gs://distl-logs/'
summary_directory = 'gs://distl-summary/'
analysis_directory = 'site_frequency/'
rel_path =  year + '/' + month + '/' + day + '-' + month + '-' + year + '.log'

logs = sc.textFile(log_directory + rel_path) \
              .filter(lambda line: '[ERROR]' not in line) \
              .map(lambda line: line.split('||')) \
              .map(lambda fields: (fields[2], 1)) \
              .reduceByKey(lambda a, b: a + b)

logs = logs.collect() 
logs.sort(key=lambda x: x[1], reverse=True)
output = open('temp_result.txt', 'w')
for line in logs:
  output.write(str(line[0]) + ' ' + str(line[1]) + '\n')
output.close()

os.system('gsutil cp temp_result.txt ' + summary_directory + analysis_directory + rel_path)
os.system('rm temp_result.txt')
