# these two lines bring in a variable 'sc' to imitate the PySpark shell
from pyspark import SparkContext
import os
import datetime


def calc_closest_brackets(pair):
    text_char_brackets = [100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600]
    bracket = text_char_brackets[0]
    smallestDiff = abs(text_char_brackets[0] - int(pair[0]))
    for x in text_char_brackets:
        if abs(x - int(pair[0])) < smallestDiff:
            smallestDiff = abs(x - int(pair[0]))
            bracket = x
    return (str(bracket), 1)


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
analysis_directory = 'text_size/'
rel_path =  year + '/' + month + '/' + day + '-' + month + '-' + year + '.log'


logs = sc.textFile(log_directory + rel_path) \
              .filter(lambda line: '[ERROR]' not in line) \
              .map(lambda line: line.split('||')) \
              .map(lambda fields: (len(fields[3]), 1)) \
              .map(calc_closest_brackets) \
              .reduceByKey(lambda a, b: a + b)

logs = logs.collect()
logs.sort(key=lambda x: x[1], reverse=True)
output = open('temp_result.txt', 'w')
for line in logs:
  output.write(str(line[0]) + ' ' + str(line[1]) + '\n')
output.close()

os.system('gsutil cp temp_result.txt ' + summary_directory + analysis_directory + rel_path)
os.system('rm temp_result.txt')
