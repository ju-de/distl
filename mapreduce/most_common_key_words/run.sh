#!/bin/bash
cd ~/hadoop/mapreduce/most_common_key_words
gcloud beta dataproc jobs submit pyspark --cluster hadoop job.py
